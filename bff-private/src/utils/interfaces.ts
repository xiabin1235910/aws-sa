import * as Koa from "koa";
import { IMiddleware } from "koa-router";
import { interfaces as inversifyInterfaces } from "inversify";
import { PARAMETER_TYPE, MethodIndex } from "./constants";

// export type KoaRequestHandler =
//     (ctx: Router.IRouterContext, next: () => Promise<any>) => any;

// export type Middleware = (inversifyInterfaces.ServiceIdentifier<any> | KoaRequestHandler)

export type Middleware = inversifyInterfaces.ServiceIdentifier<any> | IMiddleware;
export type RouterMiddleware = IMiddleware;
export type selfMiddleware = {
    identifier: string;
    cb: () => RouterMiddleware;
}

export interface ControllerMetaData {
    path: string;
    middleware: Middleware[];
    target: any;
}

export interface ControllerMethodMetaData extends ControllerMetaData {
    method: MethodIndex;
    propertyKey: string;
}

export interface ParameterMetaData {
    parameterName: string;
    index: number;
    type: PARAMETER_TYPE;
}

export interface ControllerParameterMetaData {
    [methodName: string]: ParameterMetaData[];
}

export interface HandlerDecorator {
    (target: any, propertyKey: string, descriptor: PropertyDescriptor): void
}

export class Controller {
    // [method: string]: (...args) => {};
}
