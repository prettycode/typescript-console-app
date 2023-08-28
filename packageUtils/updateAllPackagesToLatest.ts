import fs from 'fs';
import { execSync } from 'child_process';

type PackageJsonDependencies = Record<string, string>;

type PackageJson = {
    dependencies?: PackageJsonDependencies;
    devDependencies?: PackageJsonDependencies;
};

const updateDependencies = (deps: PackageJsonDependencies, depsType: keyof PackageJson): boolean => {
    let hadError = false;
    const saveFlag = depsType === 'dependencies' ? '--save' : '--save-dev';

    console.log(`Update dependencies in '${depsType}' to latest versions...`);

    for (const packageName in deps) {
        const command = `npm install ${packageName}@latest ${saveFlag}`;

        console.log(command);

        try {
            execSync(command, { stdio: 'inherit' });
        } catch (error) {
            console.error(`Failed to update ${packageName}`, error);
            hadError = true;
        }
    }

    return hadError;
};

const main = (): boolean => {
    const packageJsonString: string = fs.readFileSync('./package.json', 'utf8');
    const packageJson: PackageJson = JSON.parse(packageJsonString);

    let dependenciesHadError = false;
    let devDependenciesHadError = false;

    if (packageJson.dependencies) {
        dependenciesHadError = updateDependencies(packageJson.dependencies, 'dependencies');
    }

    if (packageJson.devDependencies) {
        devDependenciesHadError = updateDependencies(packageJson.devDependencies, 'devDependencies');
    }

    return !dependenciesHadError && !devDependenciesHadError;
};

((): void => {
    const failureNonZeroExitCode = 1;
    let succeeded = true;

    try {
        succeeded = main();
    } catch (error) {
        console.error(error);
        process.exit(failureNonZeroExitCode);
    }

    if (!succeeded) {
        process.exit(failureNonZeroExitCode);
    }
})();
