# Error Handling — Feature Specification

## 1. Overview

A system that carries errors raised in the main process **across to the renderer with their type intact** and presents them to the user in comprehensible language. It covers error classification, the cross-process serialization protocol, toast notifications, and error boundaries.

## 2. Purpose and User Value

- Show comprehensible wording instead of internal error messages.
- Distinguish recoverable from unrecoverable errors to decide whether to retry.
- Preserve error type information across the process boundary.

## 3. Error Codes

| Code               | User message                                                        | Classification keywords                |
| ------------------ | ------------------------------------------------------------------- | -------------------------------------- |
| `DB_ERROR`         | `Something went wrong while saving. Please try again.`              | `sqlite`, `database`, `constraint`     |
| `NOT_FOUND`        | `The requested item could not be found.`                            | `not found`, `no result`               |
| `VALIDATION_ERROR` | `Invalid input. Please check and try again.`                        | `invalid`, `required`, `validation`    |
| `AI_ERROR`         | `AI reflection is temporarily unavailable. Please try again later.` | `gemini`, `openai`, `ai reflection`    |
| `FEATURE_DISABLED` | `This feature requires a Pro plan.`                                 | `pro plan`, `feature is not available` |
| `UNKNOWN_ERROR`    | `An unexpected error occurred. Please try again.`                   | Anything not matched above             |

- `AppError` instances already carry a code and skip keyword classification.
- Keyword matching is **case-insensitive**.

## 4. Cross-Process Error Protocol

Electron IPC cannot carry custom properties on error objects, so a delimiter-based protocol is used.

```
[Main process]
  Error raised
    → classify into an error code
    → serialize as { __appError: true, message, code }
    → throw an Error whose message is `__APP_ERROR__` + the JSON string
         ↓ IPC boundary
[Preload]
  Locate the `__APP_ERROR__` delimiter in the message
    → parse the trailing JSON
    → rebuild an AppError with the code preserved and rethrow
         ↓
[Renderer]
  Decide retry behavior from the code, and map it to a user message
```

| Rule                                                                           |
| ------------------------------------------------------------------------------ |
| The delimiter is the literal string `__APP_ERROR__`.                           |
| It is located with `indexOf`, so any characters in the error message are safe. |
| If parsing fails, the original error is rethrown unchanged.                    |
| Crash-report IPC channels bypass this wrapper to prevent recursive reporting.  |

## 5. Functional Requirements

| ID        | Feature                       | Description                                                               |
| --------- | ----------------------------- | ------------------------------------------------------------------------- |
| FR-ERR-01 | Classify errors               | Maps an error object to one of the six codes.                             |
| FR-ERR-02 | Serialize errors              | Serializes main-process errors into the delimiter-based string.           |
| FR-ERR-03 | Deserialize errors            | Rebuilds a code-preserving error object in preload.                       |
| FR-ERR-04 | Map to user message           | Returns the user-facing message for an error code.                        |
| FR-ERR-05 | Global error toast            | Automatically shows an error toast when a mutation fails.                 |
| FR-ERR-06 | Global success toast          | Shows a toast when a mutation with a configured success message succeeds. |
| FR-ERR-07 | Query retry policy            | Decides retry behavior based on the error code.                           |
| FR-ERR-08 | Query error state             | Shows a message and retry button when a screen-level query fails.         |
| FR-ERR-09 | Render error boundary         | Catches React render errors and shows a fallback screen.                  |
| FR-ERR-10 | Automatic IPC error reporting | Sends IPC errors to crash reporting when the user has opted in.           |

## 6. Toast Notifications

| Aspect          | Value                                                     |
| --------------- | --------------------------------------------------------- |
| Maximum visible | **3**; the oldest is dropped beyond that                  |
| Deduplication   | A toast with the same message and type is not added again |
| Types           | `error`, `success`                                        |
| ID              | Generated client-side as a UUID                           |

### 6.1 Message composition

Mutations may attach a contextual prefix.

| Configuration | Displayed text                                |
| ------------- | --------------------------------------------- |
| No prefix     | `<user message for the error code>`           |
| With prefix   | `<prefix>: <user message for the error code>` |
| Silent        | No toast shown                                |

Example — note save failure → `Note failed to save: Something went wrong while saving. Please try again.`

## 7. Retry Policy

| Target    | Policy                                                                                                      |
| --------- | ----------------------------------------------------------------------------------------------------------- |
| Queries   | `NOT_FOUND`, `VALIDATION_ERROR`, and `FEATURE_DISABLED` are never retried; everything else retries **once** |
| Mutations | Never retried                                                                                               |

### 7.1 Query cache policy

| Setting                 | Value      |
| ----------------------- | ---------- |
| Stale time              | 5 minutes  |
| Garbage collection time | 30 minutes |
| Refetch on window focus | Disabled   |

## 8. Screens and Interaction

### 8.1 Query error state (`QueryErrorState`)

| Element | Content                                               |
| ------- | ----------------------------------------------------- |
| Text    | User message for the error code                       |
| Button  | `Retry` (shown only when a retry handler is provided) |

### 8.2 Render crash fallback (`CrashErrorBoundary`)

| Element     | Content                                                            |
| ----------- | ------------------------------------------------------------------ |
| Title       | `Something went wrong`                                             |
| Description | `An unexpected error occurred. Please reload the app to continue.` |
| Button      | `Reload App`                                                       |

## 9. Business Rules

| ID        | Rule                                                                                                        |
| --------- | ----------------------------------------------------------------------------------------------------------- |
| BR-ERR-01 | Internal error messages are never shown verbatim; they are always mapped to the code's user message.        |
| BR-ERR-02 | Errors that cannot be classified fall back to `UNKNOWN_ERROR`.                                              |
| BR-ERR-03 | Mutation error toasts are owned by the global handler; individual screens do not raise duplicate toasts.    |
| BR-ERR-04 | Non-mutation paths such as streaming raise toasts directly.                                                 |
| BR-ERR-05 | Operations using optimistic updates roll back to the previous state before showing the toast.               |
| BR-ERR-06 | Argument values are fully redacted when IPC errors are forwarded to crash reporting.                        |
| BR-ERR-07 | Because classification is keyword-based, changing an error message's wording can change its classification. |

## 10. Related Features

- Error reporting: [`crash-report`](../crash-report/spec.en.md)
- Feature gating errors: [`plan-feature-flag`](../plan-feature-flag/spec.en.md)

## 11. Current Limitations and Future Work

- Classification relies on **keyword matching against message strings**. Almost nothing in the repository layer throws an explicit `AppError`, so most errors are classified after the fact from their wording.
- Error messages are hard-coded in English; there is no localization.
- With only six codes, distinct situations such as network or permission failures cannot be separated.
- Users cannot expand or copy error details.
- Toast auto-dismiss timing is delegated to a shared component outside this app's code.
