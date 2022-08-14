import { RESTDataSource } from "../modules/data-source/RESTDataSource";
import { inject, injectable } from "inversify";
import { HeadersInit } from "node-fetch"

@injectable()
export default class AdService extends RESTDataSource {
    name: string = 'bapi';

    constructor(@inject('bapi') private bapiPrefix: string) {
        super();
        this.baseURL = this.bapiPrefix;
    }

    async getAd(adId: string = '', headers: HeadersInit) {
        return await this.get(`/ads/${adId}`, undefined, { headers })
    }
}