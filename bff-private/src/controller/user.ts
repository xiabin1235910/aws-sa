import { controller, httpGet } from "../utils/decorators";
import { Controller } from "../utils/interfaces";
import Router from "koa-router";
import { injectable, inject } from "inversify";

import UserService from "../service/user";

@controller('/user')
@injectable()
export default class UserController implements Controller {

    constructor(@inject('UserService') private userService: UserService) { }

    @httpGet('/')
    private async getUser(ctx: Router.IRouterContext, next: () => Promise<any>) {
        // const us = new UserService()
        // const res = await this.userService.getUser();
        // console.log(res)
        // ctx.body = "Hello World";
    }
}