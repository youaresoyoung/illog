---
description: Generate an AI commit message from staged changes (Groq) and commit
---

Run `pnpm gen:commit:write` via Bash. It generates a commit message from the
staged diff using Groq and commits directly with `git commit -F <tmpfile>` —
do not read the diff yourself, do not rewrite or paraphrase the message, and
do not call `git commit` yourself.

If there are no staged changes, tell the user to `git add` first and stop.

If the command fails (e.g. the `commit-msg` hook rejects the generated
format, or `lint-staged` fails), show the actual error output as-is. Do not
retry automatically with a different message.

On success, report only the resulting commit hash and first line of the
message (from the command's own output). Then ask in one short line whether
to push. Only run `git push` if the user explicitly confirms — never push
by default.
