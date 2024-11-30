import { FUTURE_TRX, NOTE_TRX, OBJECT_VAL_TRX } from "./helper/constant";
import { readFileJSON } from "./helper/file"

import { logError } from "./helper/logger";
const grabber = async (file: string) => {
    try {
        const targetFileData = await readFileJSON(file)
        if (targetFileData) {
            return Object.entries(targetFileData).filter(([key, val]) => key === NOTE_TRX || key === FUTURE_TRX || val === "" || typeof val === "object" && Object.values(val!).some(v => v === ""))
                .map(([key, va]) => {
                    if (typeof va === "object" && !Array.isArray(va)) {
                        const emptyKeys = Object.keys(va!).filter(subKey => va && subKey in va && (va as any)[subKey] === "");
                        return [OBJECT_VAL_TRX, emptyKeys.map(subKey => `${key}.${subKey}`)];
                    }
                    return [key, va]
                })
        }
        return null
    } catch (error) {
        // notice the console, there an error from grabbing data
        logError("GRABBING DATA: ", error instanceof Error ? error.message : "Unidentified error")
        return null;
    }
}


export default grabber;