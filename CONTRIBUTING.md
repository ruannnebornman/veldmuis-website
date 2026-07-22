# Contributing

Veldmuis currently has one maintainer. Pull requests provide the review and
audit trail for website changes, but an independent approval is not required
while the project has only one maintainer.

Create a short-lived branch with a neutral name, open a pull request into
`main`, review the complete diff, and wait for the required website check
before merging. Direct pushes, force pushes, and branch deletion are blocked on
`main`. Review conversations must be resolved before merge.

Before opening a pull request, run:

```sh
npm ci
npm test -- --watch=false
npm run build
```

Do not include credentials, private service URLs, or unrelated generated files.
The maintainer is the only merge authority.
