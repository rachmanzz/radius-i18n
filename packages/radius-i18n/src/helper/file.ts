import * as fs from 'fs';
import { logError } from './logger';
export const writeFile = async (file: string, content: string) => {
    try {
        fs.writeFileSync(file, content, 'utf8');
        return "OK"
    } catch (error) {
        if (error instanceof Error) return error.message
        return "message" in (error as any) ? (error as any).message : "unknown error message"
    }
}


export const readFileJSON = async (fl: string) => {
    try {
        const data = await fs.promises.readFile(fl, 'utf8');
        return JSON.parse(data)
    } catch (err) {
        logError(err instanceof Error ? err.message : "An unknown error message occurred while reading the JSON file.")
        return null 
    }
}