import { RESTDataSource } from "../modules/data-source/RESTDataSource";
import { inject, injectable } from "inversify";
import { HeadersInit } from "node-fetch"

@injectable()
export default class PriceDropService extends RESTDataSource {
    name: string = 'bapi';

    constructor(@inject('bapi') private bapiPrefix: string) {
        super();
        this.baseURL = this.bapiPrefix;
    }

    async getAlertList(headers: HeadersInit) {
        return await this.get(`/watchlist/ads`, undefined, { headers })
    }

    async deleteAlertListById(adId: string, headers: HeadersInit) {
        return await this.get(`/watchlist/ads/${adId}`, undefined, { headers })
    }

    async deleteAlertList(headers: HeadersInit) {
        return await this.delete(`/watchlist/ads`, undefined, { headers })
    }
}