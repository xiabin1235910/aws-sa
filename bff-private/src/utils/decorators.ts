import { Middleware, ControllerMetaData, ControllerMethodMetaData, HandlerDecorator, ParameterMetaData } from "./interfaces";
import { METADATA_KEY, METHOD, MethodIndex, PARAMETER_TYPE } from "./constants";

export function controller(path: string, ...middleware: Middleware[]) {
    return function (target: any) {
        let metaData: ControllerMetaData = { path, middleware, target };
        Reflect.defineMetadata(METADATA_KEY.controller, metaData, target);
    }
}

export function httpGet(path: string, ...middleware: Middleware[]) {
    return httpMethod(METHOD.GET, path, ...middleware);
}

export function httpMethod(method: MethodIndex, path: string, ...middleware: Middleware[]): HandlerDecorator {
    // target is that Either the constructor function of the class for a static member, or the prototype of the class for an instance member
    // https://www.typescriptlang.org/docs/handbook/decorators.html#method-decorators
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let metaData: ControllerMethodMetaData = { path, middleware, method, target, propertyKey };
        let metaDataList: ControllerMethodMetaData[] = Reflect.getOwnMetadata(METADATA_KEY.controllerMethod, target.constructor) || [];
        metaDataList.push(metaData);

        Reflect.defineMetadata(METADATA_KEY.controllerMethod, metaDataList, target.constructor);
    }
}

export const request = paramDecoratorFactory(PARAMETER_TYPE.REQUEST);
export const response = paramDecoratorFactory(PARAMETER_TYPE.RESPONSE);
export const requestParam = paramDecoratorFactory(PARAMETER_TYPE.PARAMS);
export const queryParam = paramDecoratorFactory(PARAMETER_TYPE.QUERY);
export const requestBody = paramDecoratorFactory(PARAMETER_TYPE.BODY);
export const requestHeaders = paramDecoratorFactory(PARAMETER_TYPE.HEADERS);
export const cookies = paramDecoratorFactory(PARAMETER_TYPE.COOKIES);
export const next = paramDecoratorFactory(PARAMETER_TYPE.NEXT);
export const context = paramDecoratorFactory(PARAMETER_TYPE.CTX);
export const copyBapiHeaders = paramDecoratorFactory(PARAMETER_TYPE.BAPI_HEADER);
export const container = paramDecoratorFactory(PARAMETER_TYPE.CONTAINER)

function paramDecoratorFactory(parameterType: PARAMETER_TYPE): (name?: string) => ParameterDecorator {
    return function (name?: string): ParameterDecorator {
        name = name || "default";
        return queryParams(parameterType, name);
    };
}

export function queryParams(type: PARAMETER_TYPE, parameterName: string) {
    return function (target: Object, propertyKey: string | symbol, paramterIndex: number) {

        let parameterMetaData: ParameterMetaData = {
            index: paramterIndex,
            parameterName,
            type,
        }

        let parameterMetaDataList: ParameterMetaData[] = Reflect.getOwnMetadata(METADATA_KEY.controllerParameter, target.constructor, propertyKey) || [];
        parameterMetaDataList.push(parameterMetaData);

        Reflect.defineMetadata(METADATA_KEY.controllerParameter, parameterMetaDataList, target.constructor, propertyKey);
    }
}