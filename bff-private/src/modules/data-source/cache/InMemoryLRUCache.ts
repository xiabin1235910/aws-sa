/// <reference path="../../../types/lru-cache.d.ts"/>

import { KeyValueCache, KeyValueCacheOptions } from "./KeyValueCache";
import LRUCache, { LRUCacheOptions } from 'lru-cache';

const DEFAULT_MARKO_ASYNC_TIMEOUT = 10 * 1000;

const DEFAULT_RATIO = 2;

export class InMemoryLRUCache<V = string> implements KeyValueCache<V> {
    private store: LRUCache<string, V>;

    constructor({
        max = 0,
        maxAge = DEFAULT_MARKO_ASYNC_TIMEOUT * DEFAULT_RATIO,
        length,
        dispose,
        stale,
        noDisposeOnSet,
        updateAgeOnGet,
    }: LRUCacheOptions) {
        this.store = new LRUCache({
            max,
            maxAge,
            length,
            dispose,
            stale,
            noDisposeOnSet,
            updateAgeOnGet,
        });
    }

    get(key: string): V {
        return this.store.get(key);
    }
    set(key: string, value: V, options?: KeyValueCacheOptions): void {
        if (options && options.ttl) {
            this.store.set(key, value, options.ttl * 1000);
        } else {
            this.store.set(key, value);
        }
    }
    delete(key: string): void {
        this.store.del(key);
    }

}