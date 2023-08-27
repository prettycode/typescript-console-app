## TO-DO

1. Add tests and testing-related npm scripts, and incorporate testing-related scripts into existing scripts as-needed (i.e. `build:*`)
2. Add Azure Pipeline YAML.
3. Resolve questions in README.md.
4. Complete incomplete tasks (❌) irom README.md.
5. Add everything for requirement: any packages used in this project must be approved/disapproved according to a `.package-licene-approvelist.json` file.
6. Code coverage?

## NPM Scripts

These **requirements** should be fulfilled by the available npm scripts in this project:

1. Developer must be able to know what version of Node.js is required to run the project by reading the contents of this project's `package.json` file. (❌)
2. Developer must be able to run an npm script that switches to the appropriate version of Node that's required to run the project, without knowing what that version is. (❌)
3. Developer must be able to clone repository, run `npm start`, and have the program execute without returning a non-zero exit code, regardless of the developer's Node and globally-installed package versions.
   (`npm start` + ❌)
4. Developer must be able to know what version of npm was used to generate the `package-lock.json` file by reading the contents of this project's `package.json` file.
   (devDependency in `package.json`)
5. Developer must be able to run an npm script that "cleans up" the formatting of all files in the project.
   (`npm run prettier:fix`)
6. Developer must be able to run an npm script that fixes all fixable coding guideline violations in all the code in the project.
   (`npm run lint:fix`)
7. Developer must be able to run an npm script that fixes all fixable `npm audit` vulnerabilities.
   (`npm run audit:fix`)
8. Developer must be able to run an npm script that fixes all fixable CI rule violations before committing code.
   (`npm run build:fix`)
9. Developer must be able to run an npm script that checks for CI rule violations before committing code.
   (`npm run build:ci`)

The **npm scripts** in this project:

-   `start` — Installs any missing packages and runs the TypeScript program within a context of the required environmental variables set.
-   `versions` — Displays the current versions of Node.js and npm.
-   `install:ci` — Deletes the `node_modules` folder and installs packages according to `package-lock.json` (_not_ `package.json`).
-   `install:local` — Installs any missing packages.
-   `outdated:ci` — Reports any packages with newer published version. Non-zero exit code if there are any.
-   `outdated:fix` — Updates any existing package to latest _minor_ and patch version, and saves the new version numbers to `package.json` and `package-lock.json`.
-   `audit:ci` — Runs a security audit without making any changes. Non-zero exit code if it finds _any_-severity package vulnerability.
-   `audit:fix` — Updates packages that have security vulnerabilities, and saves the new version numbers to `package.json` and `package-lock.json`. Forces _major_ semver version changes if necessary.
-   `prettier:ci` — Checks if files conform to Prettier's styling rules. Non-zero exit code if violations are found.
-   `prettier:fix` — Automatically fixes Prettier styling violations by reformatting files. Run _before_ linting.
-   `lint:ci` — Checks for linting violations. Non-zero exit code if it finds _any_ violations.
-   `lint:fix` — Automatically fixes fixable linting violations. Run _after_ prettifying.
-   `build:ci` — Display tooling versions, delete `node_modules` and install packages from `package-lock.json`, exit if any npm packages are outdated, exit if there are _any_ security vulnerabilities, exit if there are any styling violations, and exit if there are _any_ linting violations.
-   `build:fix` — Display tooling versions, installs packages, update those packages and `package.json`` to latest _minor_ (or patch) versions, fix any security vulnerabilities by (if necessary) updating packages to latest _major_ versions, fix any style/formatting violations, and fix any linting violations.
-   `start:ci` — Runs the TypeScript program within a context of the required environmental variables set.
-   `start:fix` — Runs `build:fix`, then `start:ci`.
-   `precommit` — Runs `build:fix`, `build:ci`, then `start:ci`. Useful for double-checking everything is ready for committing.

The typical **developer workflow** that results from using these scripts:

1. Clone repository.
2. `npm start` to see what it does/whether it appears to work.
3. Make changes to code.
4. `npm run start:fix` to validate the changes and their effects.
5. Make more change to the code based the prior changes' affect.
6. `npm run start:fix` again to validate the additional changes.
7. Iterate on the code and become annoyed by full `build:fix` every time.
8. `npm run start:ci`, instead, to skip the `build:fix` portion and just execute the code.
9. More iteration on code.
10. `npm run start:ci` to validate iterations quickly.
11. Ready to commit code.
12. `npm run precommit` to run full fix and validation process before submitting.

The **CI rules** a branch must pass to succeed build validation:

1. No package may be older than the latest minor and patch version. (❌ `npm update --save` but with with _major_ versions; have to do `npm install XYZ@latest --save[-dev]` for each package as a workaround)
2. No packages may have known security vulnerabilities of _any_ severity.
3. No npm script may rely on npm packages installed globally.
4. No files may have any formatting-style violations.
5. No code may have any coding guideline violations.
6. No unit tests may be failing.
7. The program must be able to execute without returning a non-zero exit code after building.
