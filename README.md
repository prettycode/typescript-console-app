## NPM Scripts

Available scripts in this project should meet these requirements:

1. Developer must be able to know what version of Node.js is required to run the project by reading the contents of this project's `package.json` file.
2. Developer must be able to run an npm script that switches to the appropriate version of Node that's required to run the project, without knowing what that version is.
3. Developer must be able to clone repository, run `npm start`, and have the program execute without returning a non-zero exit code, regardless of the developer's Node and globally-installed package versions.
4. Developer must be able to run an npm script that "cleans up" the formatting of all files in the project.
5. Developer must be able to run an npm script that fixes any fixable coding guideline violations in all the code in the project.
6. Developer must be able to run an npm script that fixes any fixable CI Rule violations before committing code.
7. Developer must be able to run an npm script that checks for CI Rule violations before committing code.

CI Rules:

1. No package may be older than the latest minor and patch version.
2. No packages may have known security vulnerabilities of _any_ severity.
3. No files may have any formatting-style violations.
4. No code may have any coding guideline violations.
5. The program must be able to execute without returning a non-zero exit code after building.

NPM Scripts in this project:

-   `versions` — Displays the current versions of Node.js and npm.
-   `prettier:ci` — Checks if files conform to Prettier's styling rules. Non-zero exit code if violations are found.
-   `prettier:fix` — Automatically fixes Prettier styling violations by reformatting code. Run _before_ linting.
-   `lint:ci` — Checks for linting violations. Non-zero exit code if it finds _any_ violations.
-   `lint:fix` — Automatically fixes fixable linting violations. Run _after_ prettifying.
-   `audit:ci` — Runs a security audit without making any changes. Non-zero exit code if it finds _any_-severity package vulnerability.
-   `audit:fix` — Updates packages having security vulnerabilities. Forces _major_ semver version changes if necessary.
-   `build:ci` — Display toolchain versions, exit if any npm packages are outdated, exit if there are _any_ security vulnerabilities, delete `node_modules` and install packages from `package-lock.json`, exit if there are any styling violations, and exit if there are _any_ linting violations.
-   `build:local` — Display toolchain versions, installs packages, update those packages and package.json to latest _minor_ (or patch) versions, fix any security vulnerabilities by—if necessary—updating packages to latest _major_ versions, fix any style violations, and fix any linting violations.
-   `start` — Runs the TypeScript program within a context of the required environmental variables having been set.
-   `start:local` — Runs `build:local`, then `start`.
-   `precommit` — Runs `build:local`, `build:ci`, then `start`. Useful for double-checking everything is ready for committing.

Resulting typical developer workflow:

1. Clone repository.
2. `npm start` to see what it does/whether it appears to work.
3. Make changes to code.
4. `npm run start:fix` to validate the changes and their effects.
5. Make more change to the code based the prior changes' affect.
6. `npm run start:fix` to validate the additional changes.
7. Iterate on the code and become annoyed by full `build:fix` every time.
8. `npm run start:ci` to skip the `build:fix` portion and just execute the code.
9. More iteration on code.
10. `npm run start:ci` to validate iterations quickly.
11. Ready to commit code.
12. `npm run precommit` to run full fix and validation process before submitting.
