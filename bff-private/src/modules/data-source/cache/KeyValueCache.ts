export interface KeyValueCacheOptions {
    ttl?: number;
}

export interface KeyValueCache<V = string> {
    get(key: string): V | undefined;
    set(key: string, value: V, options: KeyValueCacheOptions): void;
    delete(key: string): void;
}