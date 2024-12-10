import { HarmBlockThreshold, HarmCategory, VertexAI } from '@google-cloud/vertexai';
import { findInstruction } from './instruction';
import { logError } from '../helper/logger';

const vertexAI = new VertexAI({ project: 'powerful-vine-414019', location: 'us-central1' });
const model = process.env["RADIUS_GEMINI_MODEL"] ?? 'gemini-1.5-pro-002';

const generativeModel = vertexAI.preview.getGenerativeModel({
    model: model,
    generationConfig: {
        'maxOutputTokens': 8192,
        'temperature': 1,
        'topP': 0.95,
        'responseMimeType': "application/json"
    },
    safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, "threshold": HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, "threshold": HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, "threshold": HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, "threshold": HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE }
    ],
});

export const createAIContent = (c: { baseLang: string, locales: string[] }, instructionContent: string) => {
    let content = findInstruction()
    if (content) {
        content = content.replaceAll("{{content}}", instructionContent)
            .replaceAll("{{locales}}", c.locales.join(", "))
    }
    return content
}


export const generateAIContent = async (content: string) => {

    try {
        const baseLang = process.env["RADIUS_LOCALE_BASE"] ?? "en"
        const locales = process.env["RADIUS_LOCALES"] ?? "en"
        const createdContent = createAIContent({baseLang, locales: locales.split(",")}, content)
        const result = await generativeModel.generateContent({
            contents: [{ role: 'user', parts: [{ text: createdContent }] }]
        });
        const data = result.response
        if (data.candidates && data.candidates.length >= 1 && data.candidates[0].content.parts.length >= 1) {
            const items = data.candidates[0]
            const content = items.content.parts[0]
            if (content.text) {
                return JSON.parse(content.text)
            }
        }
        return null
    } catch (error) {
        logError(error instanceof Error ? error.message : "Unknown error while excute ai models")
        return null
    }
}