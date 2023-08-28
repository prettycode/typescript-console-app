import fs from 'fs';
import { minimatch } from 'minimatch';
import path from 'path';

type PackageJsonDependencies = Record<string, string>;

type PackageJsonLicense = string | Required<{ type?: string }>;

type PackageJson = {
    license?: PackageJsonLicense;
    dependencies?: PackageJsonDependencies;
    devDependencies?: PackageJsonDependencies;
};

const isLicenseAllowed = (license: PackageJsonLicense = '', allowlistPatterns: Array<string>): string | false => {
    let patternIndex = -1;
    const licenseType = typeof license === 'string' ? license : license.type || '';
    const isMatch = allowlistPatterns.some((_, index, array) => minimatch(licenseType, array[(patternIndex = index)]));

    return isMatch ? allowlistPatterns[patternIndex] : false;
};

const nodeModulesPath = './node_modules';

const checkLicenses = (
    deps: PackageJsonDependencies,
    depsType: keyof PackageJson,
    allowlistPatterns: Array<string>
): boolean => {
    let hadError = false;

    console.log(`Checking licenses of dependencies in '${depsType}'...`);

    for (const packageName in deps) {
        const packageJsonPath = path.join(nodeModulesPath, packageName, 'package.json');

        if (!fs.existsSync(packageJsonPath)) {
            console.error(`Package '${packageName}' not found in '${nodeModulesPath}'. Cannot check its license.`);
            hadError = true;
            continue;
        }

        const packageJsonData: PackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const isAllowed: string | false = isLicenseAllowed(packageJsonData.license, allowlistPatterns);

        if (!isAllowed) {
            console.error(`✗ Package '${packageName}' license '${packageJsonData.license}' not in allowlist.`);
            hadError = true;
            continue;
        }

        console.log(
            `√ Package '${packageName}' license '${packageJsonData.license}' matches '${isAllowed}' allowlist pattern.`
        );
    }

    return hadError;
};

const main = (): boolean => {
    const allowlistPath = './.package-license-allowlist';

    if (!fs.existsSync(allowlistPath)) {
        console.error(
            `Required file '${allowlistPath}' not found. To permit all licenses, please create this file and insert a ` +
                'single asterisk (*) character.'
        );
        return false;
    }

    const allowlistPatterns: Array<string> = fs.readFileSync(allowlistPath, 'utf8').split('\n');
    const packageJsonString: string = fs.readFileSync('./package.json', 'utf8');
    const packageJson: PackageJson = JSON.parse(packageJsonString);

    let dependenciesHadError = false;
    let devDependenciesHadError = false;

    if (packageJson.dependencies) {
        dependenciesHadError = checkLicenses(packageJson.dependencies, 'dependencies', allowlistPatterns);
    }

    if (packageJson.devDependencies) {
        devDependenciesHadError = checkLicenses(packageJson.devDependencies, 'devDependencies', allowlistPatterns);
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
