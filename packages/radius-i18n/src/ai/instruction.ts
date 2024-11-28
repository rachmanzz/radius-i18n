import * as fs from 'fs';
import path from 'node:path';
import { logError } from '../helper/logger';
export const findInstruction = (): string | null => {
    const instructionGen = process.env["RADIUS_INSTRUCTION_GEN"] ?? "generate-i18n"

    try {
        const data = fs.readFileSync(path.resolve(__dirname, "../instructions", instructionGen + ".txt"), 'utf8');
        return data
    } catch (error) {
        logError(error instanceof Error ? error.message : "Unknown error while reading the instruction file")
        return null
    }
}