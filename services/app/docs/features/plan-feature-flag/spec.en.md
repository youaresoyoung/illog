# Plan / Feature Flags — Feature Specification

## 1. Overview

A gating system that decides feature availability based on the user's **plan**. There is no authentication today, so every user is on the local plan and all paid features are disabled.

## 2. Purpose and User Value

- Keep the boundary between free and paid features in one place in the code.
- Have the gating structure ready before authentication and billing are introduced.
- Tell users why a locked feature is locked (which plan it requires).

## 3. Terminology

| Term         | Definition                                                       |
| ------------ | ---------------------------------------------------------------- |
| Plan         | The user's subscription tier                                     |
| Feature flag | An entry holding a feature's enabled state and its required plan |
| Profile      | The user identifier plus plan                                    |

## 4. Data Model

Defined as **in-memory constants** rather than database tables (`UserService`).

### 4.1 Plans

| Plan         | Description                | In use today          |
| ------------ | -------------------------- | --------------------- |
| `local`      | Unauthenticated local user | **The only one used** |
| `free`       | Future free signed-up user | Unused (placeholder)  |
| `pro`        | Future paid user           | Unused                |
| `enterprise` | Future enterprise user     | Unused                |

### 4.2 Features

| Feature ID          | Description                              | Required plan | Implementation status               |
| ------------------- | ---------------------------------------- | ------------- | ----------------------------------- |
| `ai.reflection`     | AI reflection generated from a task note | `pro`         | Implemented (no API key configured) |
| `ai.weekly-summary` | AI weekly summary                        | `pro`         | Not implemented                     |
| `ai.suggestion`     | AI suggestions                           | `pro`         | Not implemented                     |
| `sync.cloud`        | Cloud sync                               | `pro`         | Not implemented                     |
| `export.pdf`        | PDF export                               | `pro`         | Not implemented                     |

### 4.3 Enabled features per plan

| Plan         | Enabled features                   |
| ------------ | ---------------------------------- |
| `local`      | None                               |
| `free`       | None                               |
| `pro`        | All 5                              |
| `enterprise` | All 5 (identical to `pro` for now) |

### 4.4 Current profile

| Item    | Value                     |
| ------- | ------------------------- |
| User ID | `local-user` (hard-coded) |
| Plan    | `local` (hard-coded)      |

## 5. Functional Requirements

| ID         | Feature             | Description                                                                |
| ---------- | ------------------- | -------------------------------------------------------------------------- |
| FR-PLAN-01 | Get current profile | Returns the user ID and plan.                                              |
| FR-PLAN-02 | Get plan info       | Returns the profile together with the full feature flag list.              |
| FR-PLAN-03 | Check feature       | Returns whether a given feature is available on the current plan.          |
| FR-PLAN-04 | UI gating           | Disables the related UI and shows the required plan when a feature is off. |
| FR-PLAN-05 | Server gating       | Re-verifies feature availability in the main process.                      |

## 6. Business Rules

| ID         | Rule                                                                                                            |
| ---------- | --------------------------------------------------------------------------------------------------------------- |
| BR-PLAN-01 | Every user is currently on the `local` plan, so all paid features are disabled.                                 |
| BR-PLAN-02 | The feature flag list always contains every feature, each carrying its enabled state and required plan.         |
| BR-PLAN-03 | All five features declare `pro` as the required plan.                                                           |
| BR-PLAN-04 | UI gating is not trusted on its own — availability is re-checked at the point of execution in the main process. |
| BR-PLAN-05 | When plan info has not loaded, every feature is treated as disabled (deny by default).                          |
| BR-PLAN-06 | Errors about disabled features are never retried.                                                               |

## 7. Renderer Usage

| Hook                          | Returns                                 | Purpose                        |
| ----------------------------- | --------------------------------------- | ------------------------------ |
| `useFeatureFlag(featureId)`   | `{ enabled, requiredPlan, isLoading }`  | Gate a single feature          |
| `useFeatureFlags(featureIds)` | `{ flags, isLoading }`                  | Check several features at once |
| `useCurrentPlan()`            | `{ plan, isLocal, profile, isLoading }` | Read the current plan          |

The plan is also cached in the global user store (`useUserStore`) for cases needing synchronous access. The **source of truth is the query result**; the store is only a secondary cache.

### 7.1 Gating UI example

The AI reflection button renders as follows when the feature is disabled.

```
Enabled:    [ Ask AI Reflection ]
Generating: [ Generating... ]                    (disabled)
Disabled:   [ AI Reflection (PRO plan required) ] (disabled)
```

## 8. Interface (IPC Channels)

| Channel                 | Arguments   | Returns                 |
| ----------------------- | ----------- | ----------------------- |
| `user.getPlanInfo`      | —           | `{ profile, features }` |
| `user.isFeatureEnabled` | `featureId` | `boolean`               |

## 9. Error Handling

| Situation                   | Handling                                                 |
| --------------------------- | -------------------------------------------------------- |
| Invoking a disabled feature | `FEATURE_DISABLED` — "This feature requires a Pro plan." |
| Plan info fetch failure     | All features treated as disabled                         |

## 10. Related Features

- The only gated feature: [`ai-reflection`](../ai-reflection/spec.en.md)
- Error code definitions: [`error-handling`](../error-handling/spec.en.md)

## 11. Current Limitations and Future Work

- **There is no authentication, so the plan cannot actually change.** The profile always returns `local-user` / `local`.
- Plan data is hard-coded as constants rather than stored in the database or remote config.
- Of the five features, only `ai.reflection` is implemented; the other four exist as flags only.
- There is no upgrade path (billing or marketing screen).
- Per code comments, the plan is to fetch enabled features per plan from a remote config service once authentication lands, and to store the user profile in the database.
