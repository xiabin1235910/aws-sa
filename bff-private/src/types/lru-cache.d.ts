declare module 'lru-cache' {
    export default class LRUCache<K = string, V = string> {
        constructor(options?: LRUCacheOptions);

        get(key: K): V;
        set(key: K, value: V, maxAge?: number): void;
        del(key: K): void;
    }

    export interface LRUCacheOptions {
        max?: number;
        maxAge?: number;
        length?: (n: Object, key: string) => number;
        dispose?: (key: string, value: Object) => number;
        stale?: boolean;
        noDisposeOnSet?: boolean;
        updateAgeOnGet?: boolean;
    }
}