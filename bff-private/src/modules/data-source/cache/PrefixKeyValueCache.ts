import { KeyValueCache, KeyValueCacheOptions } from "./KeyValueCache";

export class PrefixKeyValueCache<V = string> implements KeyValueCache<V> {
    constructor(private wrapped: KeyValueCache<V>, private prefix: string) { }

    get(key: string) {
        return this.wrapped.get(`${this.prefix}${key}`);
    }
    set(key: string, value: V, options: KeyValueCacheOptions): void {
        this.wrapped.set(`${this.prefix}${key}`, value, options);
    }
    delete(key: string): void {
        this.wrapped.delete(`${this.prefix}${key}`);
    }

}