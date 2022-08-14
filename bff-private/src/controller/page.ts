import { controller, httpGet, requestParam, copyBapiHeaders, container } from "../utils/decorators";
import { Controller } from "../utils/interfaces";
import Router from "koa-router";
import { injectable, inject, Container } from "inversify";
import { HeadersInit } from "node-fetch"

import { boltBFF } from "../middlewares";
import { PriceDropModel } from "../modules/page-model/priceDrop";
import { BaseModel } from "../modules/page-model/base";

function addResponseHeader(config?: string) {
    return async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
        await next();
        ctx.set('Cache-control', 'no-cache');
    }
}

@controller('/bff', addResponseHeader(), boltBFF.identifier)
@injectable()
export default class PageController implements Controller {

    constructor(@inject('PriceDropModel') private priceDropModel: PriceDropModel) { }

    // e.g http://localhost:3000/ad/1009264909240912081200209
    // price-drop / home / search-result / view-item /
    @httpGet('/:pageType')
    private async getPageModel(
        @requestParam('pageType') pageType: string,
        @copyBapiHeaders() bapiHeader: HeadersInit,
        @container() container: Container,
        ctx: Router.IRouterContext,
    ) {
        // const res = await this.adService.getAd('1009264909240912081200209', bapiHeader);
        // price-drop ---> PriceDrop,  home ---> Home
        const modelType = pageType.split('-').map(item => item.charAt(0).toUpperCase() + item.slice(1)).join('');
        const pageInstance = container.get<BaseModel>(modelType + 'Model');
        pageInstance.initialize(bapiHeader);
        console.log(123)
        ctx.body = await pageInstance.getPageModel();
        console.log(ctx.body)
    }
}