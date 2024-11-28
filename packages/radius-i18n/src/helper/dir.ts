import * as fs from 'fs';
import { logError } from './logger';
export const checkDir = async (dir: string): Promise<"EXIST" | "FILE" | "NOTEXIST" | "UNKNOWN"> => {
  try {
    const stats = fs.statSync(dir);
    if (stats.isDirectory()) {
      return "EXIST"
    }
    return "FILE"
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('ENOENT')) {
      return "NOTEXIST"
    } else {
      return "UNKNOWN"
    }
  }
}

export const createNotExistDir = async (dir: string) => {
    try {
      const dirStatus = await checkDir(dir)
      if (dirStatus === "FILE") throw new Error("Unable to create the directory because the file is named as" + dir)
      if (dirStatus === "NOTEXIST") fs.mkdirSync(dir, {recursive: true})
      return true
    } catch (error) {
      logError(error instanceof Error ? error.message : "An unknown error message occurred while executing the check and creating the directory.")
      return false
    }
  }