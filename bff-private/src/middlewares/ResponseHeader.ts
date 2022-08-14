import Router from "koa-router";
import { selfMiddleware } from "../utils/interfaces";

// All the function should bind to inversify container 

export const boltBFF: selfMiddleware = {
    identifier: 'boltBFF',
    cb: () => {
        return async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
            await next();
            ctx.set('X-BOLT-SERVICE', 'BFF');
        }
    }
}