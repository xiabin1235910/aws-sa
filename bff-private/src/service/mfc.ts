import { inject, injectable } from "inversify";
import { RESTDataSource } from "../modules/data-source/RESTDataSource";
import { HeadersInit } from "node-fetch"

@injectable()
export default class MFCService extends RESTDataSource {
    // should be the name of the micro service
    name: string = 'bolt-service-mfc-integration';

    constructor(@inject('ms') private msPrefix: string) {
        super();
        this.baseURL = `${this.msPrefix}/${this.name}`;
    }

    async getMFC(adId: string = '', headers: HeadersInit) {
        return await this.get(`/mfcdata/${adId}`, undefined, { headers })
    }

}