import { RESTDataSource } from "../modules/data-source/RESTDataSource";
import { inject, injectable } from "inversify";
import { HeadersInit } from "node-fetch"

@injectable()
export default class LocationService extends RESTDataSource {
    name: string = 'bapi';

    constructor(@inject('bapi') private bapiPrefix: string) {
        super();
        this.baseURL = this.bapiPrefix;
    }

    async getLocation(headers: HeadersInit) {
        return await this.get(`/locations`, undefined, { headers })
    }
}