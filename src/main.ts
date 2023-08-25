import { parse } from 'ts-command-line-args';
import dotenv from 'dotenv';

type CommandLineArgs = {
    withdrawalsStartEpoch?: number;
    ignoreRecordsBeforeInclusive?: string;
};

export type AppConfig = {
    beaconchainApiKey: string;
    validatorEthAddress: string;
    withdrawalsStartEpoch: number;
    ignoreRecordsBeforeInclusive: number;
};

function getCommandLineArgs(): CommandLineArgs {
    return parse<CommandLineArgs>({
        withdrawalsStartEpoch: {
            type: Number,
            optional: true
        },
        ignoreRecordsBeforeInclusive: {
            type: String,
            optional: true
        }
    });
}

function getAppConfig(): AppConfig {
    dotenv.config();

    const beaconchainApiKey = process.env.BEACONCHAIN_APIKEY;

    if (!beaconchainApiKey) {
        throw new Error('Missing `BEACONCHAIN_APIKEY` environmental variable.');
    }

    const validatorEthAddress = process.env.VALIDATOR_ETHADDRESS;

    if (!validatorEthAddress) {
        throw new Error('Missing `VALIDATOR_ETHADDRESS` environmental variable.');
    }

    const args = getCommandLineArgs();

    let withdrawalsStartEpoch = Number(args.withdrawalsStartEpoch);

    if (isNaN(withdrawalsStartEpoch) || withdrawalsStartEpoch === 0) {
        // The first epoch that withdrawals were enabled in
        withdrawalsStartEpoch = 194516;
    }

    const ignoreRecordsBeforeInclusive = new Date(args.ignoreRecordsBeforeInclusive || 0).getTime();

    return {
        beaconchainApiKey,
        validatorEthAddress,
        withdrawalsStartEpoch,
        ignoreRecordsBeforeInclusive
    };
}

export async function main(): Promise<void> {
    const config = getAppConfig();

    console.log(config);
}
