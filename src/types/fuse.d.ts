declare module 'fuse.js' {
  interface FuseResult<T> { item: T; refIndex: number; score?: number; matches?: any[] }
  interface FuseOptions<T> { keys: string[] | { name: string }[]; threshold?: number; distance?: number; minMatchCharLength?: number }
  class Fuse<T> {
    constructor(list: T[], options?: FuseOptions<T>);
    search(pattern: string): FuseResult<T>[];
    setCollection(list: T[]): void;
  }
  export = Fuse;
}
