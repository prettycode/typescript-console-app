## NPM Scripts

-   `versions` — Displays the current versions of Node.js and npm.
-   `prettier:ci` — Checks if files conform to Prettier's styling rules. Non-zero exit code if violations are found.
-   `prettier:fix` — Automatically fixes Prettier styling violations by reformatting code. Run _before_ linting.
-   `lint:ci` — Checks for linting violations. Non-zero exit code if it finds _any_ violations.
-   `lint:fix` — Automatically fixes fixable linting violations. Run _after_ prettifying.
-   `audit:ci` — Runs a security audit without making any changes. Non-zero exit code if it finds _any_-severity package vulnerability.
-   `audit:fix` — Updates packages having security vulnerabilities. Forces _major_ semver version changes if necessary.
-   `build:ci` — Display toolchain versions, exit if any npm packages are outdated, exit if there are _any_ security vulnerabilities, delete `node_modules` and install packages from `package-lock.json`, exit if there are any styling violations, and exit if there are _any_ linting violations.
-   `build:local` — Display toolchain versions, installs packages, update those packages and package.json to latest _minor_ (or patch) versions, fix any security vulnerabilities by—if necessary—updating packages to latest _major_ versions, fix any syling violations, and fix any linting violations.
-   `start` — Runs the TypeScript program within context of required environmental variables set.
-   `start:local` — Runs `build:local`, then `start`.
-   `precommit` — Runs `build:local`, `build:ci`, then `start`. Useful for double-checking everything is ready for committing.
