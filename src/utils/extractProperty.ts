export function extractProperty<T>(baseObject: unknown, key: keyof T) {
    if (!baseObject) {
      return undefined;
    }
  
    return (<T>baseObject)[key];
  }