import { FUTURE_TRX, NOTE_TRX } from "./helper/constant";
import { createNotExistDir } from "./helper/dir";
import { readFileJSON, writeFile } from "./helper/file"
import path from "path";
import { removeKeys } from "./helper/object";

const exportContent = async (result:{[key: string]: any}, localeOpt: {
    locales: string[],
    path: string
}) => {
    for (let key in result) {
        if (localeOpt.locales.indexOf(key) >= 0 ) {
            const checkDirectory = await createNotExistDir(path.resolve(process.cwd(), localeOpt.path, key))
            if (!checkDirectory) continue
            if (Array.isArray(result[key])) {
                for (let item of result[key]) {
                    const file = item.file as string
                    
                    const content = item.content
                    const currentFileData = await readFileJSON(path.resolve(process.cwd(), localeOpt.path, key, file))
                    let nextContent: {[key: string]: any} = {}
                    if (currentFileData && typeof currentFileData === "object" && !Array.isArray(currentFileData)) {
                        nextContent = currentFileData
                    }
                    for (let cItems of content) {
                        if (/\w+\.\w+$/.test(cItems[0])) {
                            const [keyRoot, keyChild] = (cItems[0] as string).split(".")
                            if (typeof nextContent[keyRoot] === "object") {
                                if (!Array.isArray(nextContent[keyRoot])) {
                                    nextContent[keyRoot][keyChild] = cItems[1]
                                }
                                continue
                            } else {
                                nextContent[keyRoot] = {}
                                nextContent[keyRoot][keyChild] = cItems[1]
                            }
                        } else { nextContent[cItems[0]] = cItems[1] }
                    }
                    const finalContent = removeKeys(nextContent, [FUTURE_TRX, NOTE_TRX])                   
                    const writeStatus = await writeFile(path.resolve(process.cwd(), localeOpt.path, key, file), JSON.stringify(finalContent, null, 2))
                    if (writeStatus !== "OK") console.log(writeStatus, [key, file].join("/") ) 
                }
            }
        }
    }
}


export default exportContent;