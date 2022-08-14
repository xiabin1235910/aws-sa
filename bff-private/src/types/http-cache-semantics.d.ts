declare module 'http-cache-semantics' {
    import { Headers } from 'node-fetch';

    // interface CacheHeader {
    //     accept?: string;
    //     'cache-control'?: string;
    // }

    export interface CacheRequest {
        url: string;
        method: string;
        headers: Headers;
    }

    export interface CacheResponse {
        status: number;
        headers: Headers;
    }

    export default class CachePolicy {
        constructor(req: CacheRequest, res: CacheResponse);

        _url: string | undefined;
        _status: number;

        age(): number;

        responseHeaders(): Headers;

        storable(): boolean;

        timeToLive(): number;

        static fromObject(policyRaw: Object): CachePolicy;
        toObject(): Object;

        satisfiesWithoutRevalidation(req: CacheRequest): boolean;

        revalidatedPolicy(req: CacheRequest, res: CacheResponse): { policy: CachePolicy, modified: boolean };

        revalidationHeaders(req: CacheRequest): Headers;
    }
}