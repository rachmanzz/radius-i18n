import chokidar from "chokidar";
import debouncePerPath from "./helper/debounce-path";
import { mappingData } from "./data-mapper";
import { logWarning } from "./helper/logger";
const watcher = async () => {

    if (process.env["GOOGLE_APPLICATION_CREDENTIALS"] && process.env["RADIUS_LOCALE_BASE"] && process.env["RADIUS_LOCALES"] && process.env["RADIUS_LOCALE_PATH"]) {
        const debouncedFileChange = debouncePerPath(mappingData, Number(process.env["RADIUS_CHANGE_DELAY"] ?? "5000"))
        const watcher = chokidar.watch(process.env["RADIUS_LOCALE_PATH"], {
            persistent: true,
            ignoreInitial: true,
            awaitWriteFinish: true
        });

        watcher.on('all', (_, filePath) => {
            if (filePath.endsWith('.json')) {
                debouncedFileChange(filePath)
            }
        });
    } else {
        logWarning("process exist, config not setup well")
    }

}

export default watcher;
