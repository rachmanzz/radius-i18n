import grabber from "./grabber"
import { FUTURE_TRX, NOTE_TRX, OBJECT_VAL_TRX } from "./helper/constant"
import { updateDataKey, updateState } from "./state"

export const mappingData = async (filePath: string) => {
    const rawData = await grabber(filePath)
    const match = filePath.replace(/\\/g, "/").match(/([\w]+\/[\w\s]+.json)$/)
    if (match && rawData && rawData.length >= 1) {
      const notes: any[] = []
      for (let items of rawData) {
        if (Array.isArray(items) && items.length === 2 && typeof items[0] === "string") {
          if (items[0] === NOTE_TRX) {
            if (Array.isArray(items[1])) {
              notes.push(...items[1])
            }
          } else {
            if (items[0] === OBJECT_VAL_TRX) {
              if (Array.isArray(items[1])) {
                for (let it of items[1]) { updateState(it, match[1], null) }
              }
              continue
            }
            if (items[0] === FUTURE_TRX) {
              if (Array.isArray(items[1])) {
                for (let it of items[1]) { updateState(it, match[1], null) }
              }
              continue
            }
            updateState(items[0], match[1], null)
          }
        }
      }
  
      for (let note of notes) {
        if ("key" in note && typeof note["key"] === "string" && "note" in note && typeof note["note"] === "string") {
          updateDataKey(note["key"], { note: note["note"], lang: note["lang"] ?? process.env["RADIUS_LOCALE_BASE"] })
        }
      }
  
  
    }
  }