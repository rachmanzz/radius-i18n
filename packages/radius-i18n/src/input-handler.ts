import * as readline from 'readline';
import { logError, logInfo, logWarning } from './helper/logger';
import { dataProccess, waitToProcess } from "./state"
import { generateAIContent } from './ai/models';
import exportContent  from './export-content';
import { createLoading } from './helper/loading';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let autoProcessInterval: NodeJS.Timeout | null = null;

const checkChangeState = async () => {
    let isAutoCheckActive = false
    if (autoProcessInterval) {
        clearInterval(autoProcessInterval)
        isAutoCheckActive = true
    }
    if (waitToProcess() >= 1) {
        const stopLoading = createLoading()
        const content = JSON.stringify(dataProccess(), null, 2)
        const result = await generateAIContent(content)
        if (result) {
            await exportContent(result, {
                path: process.env["RADIUS_LOCALE_PATH"] ?? "./",
                locales: process.env["RADIUS_LOCALES"]?.split(",") ?? []
            })
        }
        stopLoading()

    } else { logInfo("there no data to process") }

    if (isAutoCheckActive) autoCheckState()
    else {
        console.log("\n")
        waitForInput()
    };
};

const exitProgram = () => {
    console.log('radius exit');
    rl.close();
    process.exit()
};

let countAutomation = 0;

const autoCheckState = (freze: number = 1000) => {

    if (autoProcessInterval) {
        clearInterval(autoProcessInterval);
    }

    autoProcessInterval = setInterval(() => {

        if (waitToProcess() >= 1) {
            checkChangeState();
            countAutomation = 0;
        } else {
            countAutomation++;
            const waitForFreeze = Number(process.env["RADIUS_WAIT_FOR_FREEZE"] ?? "20")
            if (countAutomation === waitForFreeze) {
                const freezeIn = Number(process.env["RADIUS_FREEZE_IN"] ?? "20000")
                logInfo(`Automation freeze for ${freezeIn} miliseconds`);
                clearInterval(autoProcessInterval!);
                autoCheckState(freezeIn);
                countAutomation = 0;
            }
        }
    }, freze);
};

export const waitForInput = () => {

    const isArgAThere = process.argv.slice(2).includes('-A');
    if (isArgAThere) {
        autoCheckState()
        return
    }

    logInfo('Press "T" for manual translation');
    logWarning('Press "A" for automated translation');
    logError('Press "Q" to quit');

    rl.question('Select your option: ', (input: string) => {
        if (input.toUpperCase() === 'T') {
            logInfo('Translation process started immediately');
            if (autoProcessInterval) {
                clearInterval(autoProcessInterval)
                autoProcessInterval = null
            }
            checkChangeState()

        } else if (input.toUpperCase() === 'A') {
            logWarning('Automated translation activated');
            autoCheckState()

        } else if (input.toUpperCase() === 'Q') {
            logError(`Process exited immediately`);
            exitProgram();
        } else {
            logError(`Input ${input} not valid`);
            waitForInput();
        }

    });


}