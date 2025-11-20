import { GoogleGenAI } from "@google/genai";
import { findInstruction } from './instruction';
import { logError } from '../helper/logger';

const model = process.env["RADIUS_GENAI_MODEL"] ?? "gemini-2.5-flash";
const MAX_RETRIES = 5;


let genAI: GoogleGenAI | null = null;

export const genInit = () => {
    genAI = new GoogleGenAI({});
}

export const createAIContent = (c: { baseLang: string, locales: string[] }, instructionContent: string) => {
    let content = findInstruction()
    if (content) {
        content = content.replaceAll("{{content}}", instructionContent)
            .replaceAll("{{locales}}", c.locales.join(", "))
    }
    return content
}


export const generateAIContent = async (content: string) => {
    if (genAI == null) {
        logError("genAI not initialized.");
        return null;
    }
    const baseLang = process.env["RADIUS_LOCALE_BASE"] ?? "en"
    const locales = process.env["RADIUS_LOCALES"] ?? "en"
    const createdContent = createAIContent({ baseLang, locales: locales.split(",") }, content)

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const result = await genAI.models.generateContent({
                model: model,
                contents: createdContent,
                config: {
                    responseMimeType: "application/json"
                }
            })
            const data = result.text
            if (data) {
                return JSON.parse(data)
            }

            logError("Gemini returned empty text response.");
        } catch (error) {
            const errMsg = error?.message ?? String(error);

            if (attempt === MAX_RETRIES - 1) {
                logError(`Exceeded max retries (${MAX_RETRIES}) for error: ${errMsg}`);
                return null; // Semua percobaan gagal
            }

            const isRetryable =
                errMsg.includes("503") ||
                errMsg.includes("UNAVAILABLE") ||
                errMsg.includes("overloaded") ||
                errMsg.includes("timeout") ||
                errMsg.includes("ECONNRESET");

            if (isRetryable) {
                const baseDelay = Math.pow(2, attempt) * 1000;
                const jitter = Math.random() * 500;
                const waitTime = baseDelay + jitter;

                logError(
                    `Retryable API error: ${errMsg} → retry in ${Math.round(waitTime)}ms ` +
                    `(Attempt ${attempt + 2}/${MAX_RETRIES})`
                );

                await new Promise(res => setTimeout(res, waitTime));
                continue;
            }

            logError(`Fatal error (no retry): ${errMsg}`);
            return null;
        }
    }
}