const TYPE = {
    Controller: Symbol("Controller")
};

const METADATA_KEY = {
    controller: "_controller",
    controllerMethod: "_controller-method",
    controllerParameter: "_controller-parameter"
};

export enum PARAMETER_TYPE {
    REQUEST,
    RESPONSE,
    PARAMS,
    QUERY,
    BODY,
    HEADERS,
    COOKIES,
    NEXT,
    CTX,
    BAPI_HEADER,
    CONTAINER,
}

const DEFAULT_ROUTING_ROOT_PATH = "/";

export { TYPE, METADATA_KEY, DEFAULT_ROUTING_ROOT_PATH };

export enum METHOD {
    PATCH = 'patch',
    GET = 'get',
    POST = 'post',
    HEAD = 'head',
    PUT = 'put',
    DELETE = 'delete',
};

export type MethodIndex = 'get' | 'post' | 'head' | 'put' | 'delete' | 'patch';
