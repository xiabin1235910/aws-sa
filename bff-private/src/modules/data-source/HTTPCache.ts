/// <reference path="../../types/http-cache-semantics.d.ts"/>

import { default as fetch, Request, Response, Headers } from 'node-fetch';

import CachePolicy, { CacheRequest, CacheResponse } from 'http-cache-semantics';

import {
    KeyValueCache,
    InMemoryLRUCache,
    PrefixKeyValueCache,
} from './cache';
import { CacheOptions } from './RESTDataSource';

export type ValueOrPromise<T> = T | Promise<T>;

export class HTTPCache {
    private keyValueCache: KeyValueCache;
    private httpFetch: typeof fetch;

    constructor(
        keyValueCache: KeyValueCache = new InMemoryLRUCache({
            updateAgeOnGet: false
        }),
        httpFetch: typeof fetch = fetch,
    ) {
        this.keyValueCache = new PrefixKeyValueCache(
            keyValueCache,
            'httpcache:',
        );
        this.httpFetch = httpFetch;
    }

    async fetch(
        request: Request,
        options: {
            cacheKey?: string;
            cacheOptions?: CacheOptions
        } = {},
    ): Promise<Response> {
        const cacheKey = options.cacheKey ? options.cacheKey : request.url;

        const entry = this.keyValueCache.get(cacheKey);
        if (!entry) {
            const response = await this.httpFetch(request);

            const policy = new CachePolicy(
                policyRequestFrom(request),
                policyResponseFrom(response),
            );

            return this.storeResponseAndReturnClone(
                response,
                request,
                policy,
                cacheKey,
                options.cacheOptions,
            );
        }

        const { policy: policyRaw, ttlOverride, body } = JSON.parse(entry);

        const policy = CachePolicy.fromObject(policyRaw);
        // Remove url from the policy, because otherwise it would never match a request with a custom cache key
        policy._url = undefined;

        if (
            (ttlOverride && policy.age() < ttlOverride) ||
            (!ttlOverride &&
                policy.satisfiesWithoutRevalidation(policyRequestFrom(request)))
        ) {
            const headers = policy.responseHeaders();
            return new Response(body, {
                // url: policy._url,
                status: policy._status,
                headers,
            });
        } else {
            const revalidationHeaders = policy.revalidationHeaders(
                policyRequestFrom(request),
            );
            const revalidationRequest = new Request(request, {
                headers: revalidationHeaders,
            });
            const revalidationResponse = await this.httpFetch(revalidationRequest);

            const { policy: revalidatedPolicy, modified } = policy.revalidatedPolicy(
                policyRequestFrom(revalidationRequest),
                policyResponseFrom(revalidationResponse),
            );

            return this.storeResponseAndReturnClone(
                new Response(modified ? await revalidationResponse.text() : body, {
                    // url: revalidatedPolicy._url,
                    status: revalidatedPolicy._status,
                    headers: revalidatedPolicy.responseHeaders(),
                }),
                request,
                revalidatedPolicy,
                cacheKey,
                options.cacheOptions,
            );
        }
    }

    private async storeResponseAndReturnClone(
        response: Response,
        request: Request,
        policy: CachePolicy,
        cacheKey: string,
        cacheOptions?: CacheOptions
    ): Promise<Response> {
        // if (cacheOptions && typeof cacheOptions === 'function') {
        //   cacheOptions = cacheOptions(response, request);
        // }

        let ttlOverride = cacheOptions && cacheOptions.ttl;

        if (
            // With a TTL override, only cache succesful responses but otherwise ignore method and response headers
            !(ttlOverride && policy._status >= 200 && policy._status <= 299) &&
            // Without an override, we only cache GET requests and respect standard HTTP cache semantics
            !(request.method === 'GET' && policy.storable())
        ) {
            return response;
        }

        let ttl =
            ttlOverride === undefined
                ? Math.round(policy.timeToLive())
                : ttlOverride;
        if (ttl <= 0) return response;

        // If a response can be revalidated, we don't want to remove it from the cache right after it expires.
        // We may be able to use better heuristics here, but for now we'll take the max-age times 2.
        if (canBeRevalidated(response)) {
            ttl *= 2;
        }

        const body = await response.text();
        const entry = JSON.stringify({
            policy: policy.toObject(),
            ttlOverride,
            body,
        });

        await this.keyValueCache.set(cacheKey, entry, {
            ttl,
        });

        // We have to clone the response before returning it because the
        // body can only be used once.
        // To avoid https://github.com/bitinn/node-fetch/issues/151, we don't use
        // response.clone() but create a new response from the consumed body
        return new Response(body, {
            // url: response.url,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });
    }
}

function canBeRevalidated(response: Response): boolean {
    return response.headers.has('ETag');
}

function policyRequestFrom(request: Request): CacheRequest {
    return {
        url: request.url,
        method: request.method,
        headers: headersToObject(request.headers),
    };
}

function policyResponseFrom(response: Response): CacheResponse {
    return {
        status: response.status,
        headers: headersToObject(response.headers),
    };
}

function headersToObject(headers: Headers) {
    const object = Object.create(null);
    for (const [name, value] of headers) {
        object[name] = value;
    }
    return object;
}
