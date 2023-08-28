import fs from 'fs';
import { minimatch } from 'minimatch';
import path from 'path';

type PackageJsonDependencies = Record<string, string>;

type PackageJson = {
    license: string | { type: string };
    dependencies?: PackageJsonDependencies;
    devDependencies?: PackageJsonDependencies;
};

const allowlistPatterns: Array<string> = fs.readFileSync('.package-license-allowlist', 'utf8').split('\n');

const isLicenseAllowed = (license: string | { type: string }): string | false => {
    const licenseType = typeof license === 'string' ? license : license.type;
    let patternIndex = -1;
    const isMatch = allowlistPatterns.some((_, index, array) => minimatch(licenseType, array[(patternIndex = index)]));

    return isMatch ? allowlistPatterns[patternIndex] : false;
};

const nodeModulesPath = './node_modules';

const checkLicenses = (deps: PackageJsonDependencies, depsType: keyof PackageJson): boolean => {
    let hadError = false;

    console.log(`Checking licenses of dependencies in '${depsType}'...`);

    for (const packageName in deps) {
        const packageJsonPath = path.join(nodeModulesPath, packageName, 'package.json');

        if (!fs.existsSync(packageJsonPath)) {
            console.error(`Package '${packageName}' not found in '${nodeModulesPath}'.`);
            hadError = true;
            continue;
        }

        const packageJsonData: PackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const isAllowed: string | false = isLicenseAllowed(packageJsonData.license);

        if (!isAllowed) {
            console.error(`x Package '${packageName}' license '${packageJsonData.license}' not in allowlist.`);
            hadError = true;
            continue;
        }

        console.info(
            `+ Package '${packageName}' license '${packageJsonData.license}' matches '${isAllowed}' allowlist pattern.`
        );
    }

    return hadError;
};

const main = (): boolean => {
    const packageJsonString: string = fs.readFileSync('./package.json', 'utf8');
    const packageJson: PackageJson = JSON.parse(packageJsonString);

    let dependenciesHadError = false;
    let devDependenciesHadError = false;

    if (packageJson.dependencies) {
        dependenciesHadError = checkLicenses(packageJson.dependencies, 'dependencies');
    }

    if (packageJson.devDependencies) {
        devDependenciesHadError = checkLicenses(packageJson.devDependencies, 'devDependencies');
    }

    return dependenciesHadError || devDependenciesHadError;
};

((): void => {
    const failureExitCode = 1;
    let succeeded = true;

    try {
        succeeded = main();
    } catch (error) {
        console.error(error);
        process.exit(failureExitCode);
    }

    if (!succeeded) {
        process.exit(failureExitCode);
    }
})();
