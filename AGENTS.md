# Project Agent Instructions

- Keep repository artifacts provider-neutral. Do not include assistant, model,
  vendor, or tool identifiers in branch names, commit messages, pull-request
  text, generated documentation, issue text, release notes, or comments unless
  explicitly requested.
- Use neutral branch names such as `feature/...`, `fix/...`, `chore/...`,
  `audit/...`, or `release/...`.
- Do not create a pull request unless explicitly asked in the current task.
- Never merge, approve, enable auto-merge, or mark a pull request ready for
  review. The maintainer is the only merge authority.
- Do not commit, push, publish, or change repository settings unless explicitly
  asked.
- Preserve unrelated worktree changes and stage only files that belong to the
  requested change.
- Run `npm test -- --watch=false` and `npm run build` before reporting website
  validation as successful.
