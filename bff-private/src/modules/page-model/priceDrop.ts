import { inject, injectable } from "inversify";

import { BaseModel, ComponentsModel } from "./base";
import PriceDropService from "../../service/priceDrop";

import { load } from "cheerio";

import { dateFromNow } from "../../utils/datetime";
import UserService from "../../service/user";

@injectable()
export class PriceDropModel extends BaseModel {
    constructor(
        @inject('PriceDropService') private priceDropService: PriceDropService,
        @inject('UserService') private userService: UserService
    ) {
        super();
    }

    _priceDropAlert(): Promise<any> {
        return this.priceDropService.getAlertList(this.bapiHeader);
    }

    async getComponents(): Promise<ComponentsModel> {
        let priceDropList = await this._priceDropAlert();
        priceDropList = JSON.parse(JSON.stringify(priceDropList));
        priceDropList.forEach((priceDrop: any) => {
            priceDrop.isPriceAmountwithMakeOffer = false;
            priceDrop.description = load(`<p>${priceDrop.description}</p>`).root().text()
            priceDrop.formattedCreationDate = {
                abbrev: dateFromNow(priceDrop.creationDate, `${this.locale}_short`),
            };
            priceDrop.saveShare = {
                encodedTitle: priceDrop.title ? encodeURIComponent(priceDrop.title) : '',
                locale: this.locale,
                shortAdId: priceDrop.id || null,
            };

        })

        return {
            priceDropList
        }
    }

    async getCurrentState() {
        const userData = await this.userService.getUser(this.bapiHeader);
        return {
            isUserLoggedIn: !!userData
        }
    }

    getSeoMeta(): any {
        // should be configured below for different sites
        return {
            title: 'Watchlist | Gumtree',
            description: 'Automotive Vehicles, Property, Jobs, Job Seekers, Services, Home & Garden, Electronics, Baby & Kids, Boats & Watercraft, Business-to-Business, Fashion, Pets, Sports & Leisure, Charity Donations, Community, Events, Online & Essential Services in Gumtree South Africa',
        }
    }

    getDataLayer(): any {
        return {
            dl: 'dl'
        }
    }

}