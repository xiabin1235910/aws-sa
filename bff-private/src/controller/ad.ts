import { controller, httpGet, requestParam, copyBapiHeaders } from "../utils/decorators";
import { Controller } from "../utils/interfaces";
import Router from "koa-router";
import { injectable, inject } from "inversify";
import { HeadersInit } from "node-fetch"

import AdService from "../service/ad";
import { boltBFF } from "../middlewares";

import { logger } from "../log/logger";

function addResponseHeader(config?: string) {
    return async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        await next();
        ctx.set('Cache-control', 'no-cache');
    }
}

@controller('/ad', addResponseHeader(), boltBFF.identifier)
@injectable()
export default class AdController implements Controller {

    constructor(@inject('AdService') private adService: AdService) { }

    // e.g http://localhost:3000/ad/1009264909240912081200209
    @httpGet('/:adId')
    private async getAd(@requestParam('adId') adId: string, @copyBapiHeaders() bapiHeader: HeadersInit, ctx: Router.IRouterContext) {
        const res = await this.adService.getAd(adId, bapiHeader);
        logger.log(res)
        ctx.body = res;
    }
}