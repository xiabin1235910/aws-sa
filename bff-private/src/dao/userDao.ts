import { BaseDAO } from "./baseDao";
import { User } from '../entity/user';

export class UserDAO extends BaseDAO<User> {

    constructor() {
        super(User);
    }

    async query(id?: number) {
        return this.queryEntityById(id);
    }
}