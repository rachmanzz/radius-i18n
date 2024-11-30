export default function debouncePerPath<T extends (path: string) => void>(func: T, delay: number) {
    const timers = new Map<string, NodeJS.Timeout>();

    return (path: string) => {
        if (timers.has(path)) {
            clearTimeout(timers.get(path));
        }

        const timer = setTimeout(() => {
            func(path);
            timers.delete(path);
        }, delay);

        timers.set(path, timer);
    };
}