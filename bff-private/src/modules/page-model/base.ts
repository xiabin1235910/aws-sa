import { injectable } from "inversify";
import { Headers, HeadersInit } from "node-fetch"

export type ComponentsModel = {
    [key: string]: any
}

export type SeoMetaModel = {
    seoMeta: any
}

export type DataLayerModel = {
    dataLayer: any
}

export type PageModel = SeoMetaModel & DataLayerModel & ComponentsModel;

@injectable()
export abstract class BaseModel {
    protected bapiHeader: HeadersInit = new Headers();
    protected locale: string = 'en_ZA';
    constructor() {

    }

    abstract getSeoMeta(): any;

    abstract getDataLayer(): any;

    abstract getComponents(): Promise<ComponentsModel>;

    // we must include the page state here not in every component
    abstract getCurrentState(): any;

    initialize(bapiHeader: HeadersInit): void {
        this.bapiHeader = bapiHeader as Record<string, string>;
        this.locale = this.bapiHeader['X-BOLT-SITE-LOCALE'];
    }

    async getPageModel(): Promise<PageModel> {

        return Promise.all([
            this.getSeoMeta(),
            this.getDataLayer(),
            this.getComponents(),
            this.getCurrentState(),
        ]).then(([seoMeta, dataLayer, components, state]) => {
            return {
                seoMeta,
                dataLayer,
                components,
                state,
            }
        })
    }
}
