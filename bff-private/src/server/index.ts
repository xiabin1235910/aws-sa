import "reflect-metadata";

import { InversifyKoaServer } from "../utils/server";

import { TYPE } from "../utils/constants"
import { Controller, ControllerMetaData } from "../utils/interfaces";
import { Container } from "inversify";

let container = new Container();

// todo glob controller directory, to dynamically register the controller below
import UserController from "../controller/user";
import AdController from "../controller/ad";
import PageController from "../controller/page";

container.bind<Controller>(TYPE.Controller).to(UserController).whenTargetNamed('UserController')
container.bind<Controller>(TYPE.Controller).to(AdController).whenTargetNamed('AdController')
container.bind<Controller>(TYPE.Controller).to(PageController).whenTargetNamed('PageController')

import { BaseModel } from "../modules/page-model/base";
import { PriceDropModel } from "../modules/page-model/priceDrop";
import { HeaderModel } from "../modules/page-model/header";
container.bind<BaseModel>('PriceDropModel').to(PriceDropModel).inTransientScope();
container.bind<BaseModel>('HeaderModel').to(HeaderModel).inTransientScope();

// todo glob service directory, to dynamically register the service below
import UserService from "../service/user";
import AdService from "../service/ad";
import PriceDropService from "../service/priceDrop";
import CategoryService from "../service/category";
import LocationService from "../service/location";
import { RESTDataSource } from "../modules/data-source/RESTDataSource";

container.bind<RESTDataSource>('UserService').to(UserService).inSingletonScope();
container.bind<RESTDataSource>('AdService').to(AdService).inSingletonScope();
container.bind<RESTDataSource>('PriceDropService').to(PriceDropService).inSingletonScope();
container.bind<RESTDataSource>('CategoryService').to(CategoryService).inSingletonScope();
container.bind<RESTDataSource>('LocationService').to(LocationService).inSingletonScope();

// todo glob middlewares directory, to dynamically register the self defined middleware below
import { RouterMiddleware } from "../utils/interfaces";
import { boltBFF } from "../middlewares/ResponseHeader";
container.bind<RouterMiddleware>(boltBFF.identifier).toFunction(boltBFF.cb());

// necessary env assert
const BAPI_IDENTIFIER = 'bapi'
const MS_IDENTIFIER = 'ms'
container.bind<string>(BAPI_IDENTIFIER).toDynamicValue(() => {
    return `http://${process.env.BOLT_VM}/boltapi/v1`
}).inSingletonScope();

container.bind<string>(MS_IDENTIFIER).toDynamicValue(() => {
    return `http://${process.env.BOLT_MS_PREFIX}/${process.env.BOLT_VM?.split('.').join('--')}`
}).inSingletonScope();

// create server
let server = new InversifyKoaServer(container);
let app = server.build();
app.listen(process.env.PORT);
