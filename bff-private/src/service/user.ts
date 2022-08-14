import { RESTDataSource } from "../modules/data-source/RESTDataSource";
import { inject, injectable } from "inversify";
import { HeadersInit } from "node-fetch"

@injectable()
export default class UserService extends RESTDataSource {
    name: string = 'bapi';

    constructor(@inject('bapi') private bapiPrefix: string) {
        super();
        this.baseURL = this.bapiPrefix;
    }

    async getUser(headers: HeadersInit) {
        return await this.get(`/users/logged-in-user-info`, undefined, { headers })
    }
}