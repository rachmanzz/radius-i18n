export function removeKeys<T extends object>(obj: T, keysToRemove: (keyof T)[]): Partial<T> {
    const newObj = { ...obj };
    keysToRemove.forEach(key => delete newObj[key]);
    return newObj;
  }