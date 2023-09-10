import { parse } from 'ts-command-line-args';
import dotenv from 'dotenv';

type CommandLineArgs = {
    debug?: boolean;
    start?: string;
};

type AppConfig = {
    secretKey: string;
    isDebug: boolean;
    startDateTimeInclusive: number;
};

function getCommandLineArgs(): CommandLineArgs {
    return parse<CommandLineArgs>({
        debug: {
            type: Boolean,
            optional: true
        },
        start: {
            type: String,
            optional: true
        }
    });
}

function getEnvironmentalVariables(): NodeJS.ProcessEnv {
    const environment = process.env.NODE_ENV?.trim() || '';
    dotenv.config({ path: `.env${environment ? `.${environment}` : ''}` });

    return process.env;
}

function getAppConfig(): AppConfig {
    const environmentalVariables = getEnvironmentalVariables();
    const cliArguments = getCommandLineArgs();

    const { SECRET_KEY } = environmentalVariables;

    if (!SECRET_KEY) {
        throw new Error('SECRET_KEY is not set in the .env file.');
    }

    const defaultDebug = false;
    const defaultStartDateTimeInclusive = 0;

    let startDateTimeInclusive = defaultStartDateTimeInclusive;

    if (cliArguments.start) {
        startDateTimeInclusive = new Date(cliArguments.start).getTime();

        if (Number.isNaN(startDateTimeInclusive)) {
            throw new Error(`Invalid start date argument value: '${cliArguments.start}'. Use an ISO 8601 date string.`);
        }
    }

    return {
        secretKey: SECRET_KEY,
        isDebug: cliArguments.debug ?? defaultDebug,
        startDateTimeInclusive
    };
}

export async function main(): Promise<void> {
    const appConfig = getAppConfig();
    const { secretKey: _secretKey, ...logSafeAppConfig } = appConfig;

    console.log(logSafeAppConfig);
}
