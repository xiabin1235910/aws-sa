import Router from "koa-router";
import Koa from "koa";
import cors from "@koa/cors";

import { Container } from "inversify";
import { TYPE, METADATA_KEY, PARAMETER_TYPE } from "./constants";
import { Middleware, RouterMiddleware, Controller, ControllerMetaData, ControllerMethodMetaData, ParameterMetaData } from "./interfaces";
import { IncomingHttpHeaders } from "http";

export class InversifyKoaServer {
    private _router: Router;
    private _container: Container;
    private _app: Koa;

    constructor(
        container: Container,
        customRouter?: Router,
        customApp?: Koa
    ) {
        this._container = container;
        this._router = customRouter || new Router();
        this._app = customApp || new Koa();

        this.build();
    }

    public build(): Koa {
        this._app.use(cors());

        this.registerControllers();
        return this._app;
    }


    private registerControllers() {
        let controllers = this._container.getAll<Object>(TYPE.Controller);

        controllers.forEach((controller) => {
            let controllerMetaData: ControllerMetaData = Reflect.getOwnMetadata(METADATA_KEY.controller, controller.constructor)

            let methodMetaData: ControllerMethodMetaData[] = Reflect.getOwnMetadata(METADATA_KEY.controllerMethod, controller.constructor)

            if (controllerMetaData && methodMetaData) {
                let controllerMiddleware = this.resolveMiddleware(controllerMetaData.middleware);
                methodMetaData.forEach((metaData) => {
                    let parameterMetaData: ParameterMetaData[] = Reflect.getOwnMetadata(METADATA_KEY.controllerParameter, controller.constructor, metaData.propertyKey) || [];

                    let handler = this.handlerFactory(controllerMetaData.target.name, metaData.propertyKey, parameterMetaData);

                    let routerMiddleware = this.resolveMiddleware(metaData.middleware);
                    this._router[metaData.method](
                        `${controllerMetaData.path}${metaData.path}`,
                        ...controllerMiddleware,
                        ...routerMiddleware,
                        handler
                    )
                })
            }
        })

        this._app.use(this._router.routes());
    }

    private resolveMiddleware(middleware: Middleware[]): RouterMiddleware[] {
        return middleware.map(item => {
            try {
                return this._container.get<RouterMiddleware>(item);
            } catch (_) {
                return item as RouterMiddleware;
            }
        })
    }

    private handlerFactory(controllerName: string, propertyKey: string, parameterMetaData: ParameterMetaData[]): RouterMiddleware {
        return async (ctx, next) => {
            let args = this.extractParameters(ctx, next, parameterMetaData);
            const instance = this._container.getNamed<Controller>(TYPE.Controller, controllerName) as Record<string, (...args: any[]) => any>;
            const result = instance[propertyKey](...args);

            if (result && result instanceof Promise) {
                return result;
            } else if (result && !ctx.headerSent) {
                ctx.body = result;
            }
        }
    }

    private extractParameters(ctx: Router.IRouterContext, next: () => any, params: ParameterMetaData[]) {
        let args = [];
        for (let param of params) {
            switch (param.type) {
                case PARAMETER_TYPE.PARAMS:
                    args[param.index] = ctx.params[param.parameterName]; break;
                case PARAMETER_TYPE.QUERY:
                    args[param.index] = ctx.query[param.parameterName]; break;
                case PARAMETER_TYPE.COOKIES:
                    args[param.index] = ctx.cookies.get(param.parameterName); break;
                case PARAMETER_TYPE.BODY:
                    const body = ctx.body as Record<string, string[]>;
                    args[param.index] = body[param.parameterName]; break;
                case PARAMETER_TYPE.HEADERS:
                    args[param.index] = ctx.get(param.parameterName); break;
                case PARAMETER_TYPE.CTX:
                    args[param.index] = (ctx as Record<string, any>)[param.parameterName]; break;
                case PARAMETER_TYPE.BAPI_HEADER:
                    args[param.index] = this.generateBapiHeaders(ctx); break;
                case PARAMETER_TYPE.CONTAINER:
                    args[param.index] = this._container; break;
                default:
                    args[param.index] = ctx; break;
            }
        }

        args.push(ctx, next)

        return args;
    }

    private generateBapiHeaders(ctx: Router.IRouterContext): IncomingHttpHeaders {
        const headerTemplate: { [key: string]: string } = {
            'Content-type': 'application/json',
            'X-SITE-LOCALE': ctx.get('BFF-SITE-LOCALE'),
            'X-MACHINE-ID': ctx.get('BFF-MACHINE-ID'),
            'X-TRACE-ID': ctx.get('BFF-TRACE-ID'),
            'X-IP-ADDRESS': ctx.get('BFF-IP-ADDRESS'),
            'Authorization': `Bearer ${ctx.get('BFF-TOKEN')}`,
        };
        return headerTemplate
    }
}
