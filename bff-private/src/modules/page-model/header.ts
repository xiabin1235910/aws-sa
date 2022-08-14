import CategoryService from "../../service/category";
import { inject, injectable } from "inversify";
import { BaseModel, ComponentsModel } from "./base";
import LocationService from "../../service/location";

@injectable()
export class HeaderModel extends BaseModel {

    constructor(
        @inject('CategoryService') private categoryService: CategoryService,
        @inject('LocationService') private locationService: LocationService,
    ) {
        super();
    }

    getSeoMeta() {
        // no seo meta data for header
    }
    getDataLayer() {
        // no extra data layer info for header
    }
    getCurrentState() {
        // header is the static model, no state and dynamic component needed
        // the dynamic state including login state should be included in every page
    }
    async getComponents(): Promise<ComponentsModel> {
        const categoryTree = await this.categoryService.getCategory(this.bapiHeader);
        const locationTree = await this.locationService.getLocation(this.bapiHeader);

        return {
            searchBar: {
                categoryTree,
                locationTree,
            }
        }
    }

}