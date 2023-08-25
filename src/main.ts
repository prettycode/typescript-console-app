import { parse } from 'ts-command-line-args';
import dotenv from 'dotenv';

type CommandLineArgs = {
    example1?: number;
    example2?: string;
};

type AppConfig = {
    setting1: boolean;
    setting2: number;
    setting3: string;
};

function getCommandLineArgs(): CommandLineArgs {
    return parse<CommandLineArgs>({
        example1: {
            type: Number,
            optional: true
        },
        example2: {
            type: String,
            optional: true
        }
    });
}

function getEnvironmentalVariables(): NodeJS.ProcessEnv {
    dotenv.config();
    return process.env;
}

function getAppConfig(): AppConfig {
    const environmentalVariables = getEnvironmentalVariables();
    const cliArguments = getCommandLineArgs();

    const defaultExample1 = 42069;
    const defaultExample2 = 'default value';

    return {
        setting1: environmentalVariables.SETTING1 === 'true',
        setting2: cliArguments.example1 ?? defaultExample1,
        setting3: cliArguments.example2 ?? defaultExample2
    };
}

export async function main(): Promise<void> {
    console.log(getAppConfig());
}
