import { readFileJSON } from "../helper/file";
import { logError } from "../helper/logger";
import { waitForInput } from "../input-handler";
import watcher from "../watcher";

const startRadius = async () => {
    try {
        const config = await readFileJSON("./config.radius.json")
        for (let key in config) {
            if (key === "service_resource") {
                process.env["GOOGLE_APPLICATION_CREDENTIALS"] = config[key]
                continue
            }
            if (["locale_base", "locales", "locale_path", "change_delay", "freeze_in", "wait_for_freeze", "gemini_model"].indexOf(key) >= 0) {
                const ENV_KEY = key.toUpperCase();
                process.env["RADIUS_" + ENV_KEY] = Array.isArray(config[key]) ? config[key].join(",") : config[key];
            }
        }
        await watcher()
    } catch (error) {
        logError("message" in (error as any) ? (error as any).message : "unknown error message" )
    }
}

startRadius()
waitForInput()

export default startRadius;