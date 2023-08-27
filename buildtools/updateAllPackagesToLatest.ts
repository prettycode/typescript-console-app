// TODO: Break the script into --check and --fix modes; this is really the --fix mode and there is no --check mode yet

import fs from 'fs';
import { execSync } from 'child_process';

type PackageJson = {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
};

const updateDependencies = (deps: Record<string, string>, saveFlag: string, failImmediately: boolean): boolean => {
    let hadError = false;

    for (const packageName in deps) {
        const command = `npm install ${packageName}@latest ${saveFlag}`;

        console.log(command);

        try {
            execSync(command, { stdio: 'inherit' });
        } catch (error) {
            if (failImmediately) {
                throw error;
            }

            console.warn(`Failed to update ${packageName}`, error);
            hadError = true;
        }
    }

    return hadError;
};

const main = (failImmediately: boolean): boolean => {
    const packageJsonString: string = fs.readFileSync('./package.json', 'utf8');
    const packageJson: PackageJson = JSON.parse(packageJsonString);
    let hadError = false;

    if (packageJson.dependencies) {
        hadError = hadError || updateDependencies(packageJson.dependencies, '--save', failImmediately);
    }

    if (packageJson.devDependencies) {
        hadError = hadError || updateDependencies(packageJson.devDependencies, '--save-dev', failImmediately);
    }

    return hadError;
};

((): void => {
    const failureExitCode = 1;
    const failImmediately = process.argv.includes('--ci');
    let succeeded = true;

    try {
        succeeded = main(failImmediately);
    } catch (error) {
        console.error(error);
        process.exit(failureExitCode);
    }

    if (!succeeded) {
        process.exit(failureExitCode);
    }
})();
