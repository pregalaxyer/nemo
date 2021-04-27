'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs$1 = require('fs-extra');
var path = require('path');
var mustache = require('mustache');
var fetch = require('node-fetch');
var fs$2 = require('fs');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () {
                        return e[k];
                    }
                });
            }
        });
    }
    n['default'] = e;
    return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespace(fs$1);
var path__namespace = /*#__PURE__*/_interopNamespace(path);
var mustache__namespace = /*#__PURE__*/_interopNamespace(mustache);
var fetch__namespace = /*#__PURE__*/_interopNamespace(fetch);
var fs__namespace$1 = /*#__PURE__*/_interopNamespace(fs$2);

async function writeMustacheFile(temp, view, src) {
    try {
        const modelData = mustache__namespace.render(temp, view);
        await fs__namespace.writeFileSync(path__namespace.join(src, `./${view.name}.ts`), modelData);
    }
    catch (err) {
        throw Error(`write model file error: ${err}`);
    }
}

async function getTemplates() {
    const templatePath = path__namespace.resolve(__dirname, '../template');
    const temps = await fs__namespace$1.readdirSync(templatePath);
    const templates = {};
    for (let i = 0; i < temps.length; i++) {
        templates[temps[i].split('.mustache')[0]] = await fs__namespace$1.readFileSync(path__namespace.join(templatePath, '/' + temps[i]), 'utf-8');
    }
    return templates;
}

async function fetchApiJson(url) {
    try {
        const res = await fetch__namespace(url).then(res => res.json());
        return res;
    }
    catch (err) {
        throw Error(`fetch swagger api json data error: ${err}`);
    }
}

const fs = require('fs-extra');
async function writeInterfaces(models, templates, path) {
    try {
        await fs.mkdirsSync(path + '/models');
        const res = await Promise.all(models.map(model => writeMustacheFile(templates.model, model, path + '/models')));
    }
    catch (err) {
        console.error(err);
    }
}

async function writeServices(services, templates, path, requestPath) {
    try {
        await fs__namespace.mkdirsSync(path + '/services');
        const res = await Promise.all(services.map(service => writeMustacheFile(templates.service, {
            ...service,
            requestPath
        }, path + '/services')));
    }
    catch (err) {
        console.error(err);
    }
}

async function writeIndex(files, templete, path) {
    try {
        const res = await writeMustacheFile(templete.index, {
            exports: files.map(file => ({
                filepath: file.replace(/\.ts$/, ''),
                filename: file.split('/').pop().replace(/\.ts$/, '')
            })),
            name: 'index'
        }, path);
    }
    catch (err) {
        console.error(err);
    }
}

async function writeRequest(templates, path) {
    try {
        await fs__namespace.mkdirsSync(path + '/request');
        await Promise.all([
            writeMustacheFile(templates.request, {
                name: 'index'
            }, path + '/request'),
            writeMustacheFile(templates['request.d'], {
                name: 'index.d'
            }, path + '/request')
        ]);
    }
    catch (err) {
        console.error(err);
    }
}

function convertModels(definitions) {
    const models = [];
    const interfaceNames = Object.keys(definitions);
    interfaceNames.forEach(interfaceName => {
        const model = {
            name: converDefinitionProperty(definitions[interfaceName].title || interfaceName),
            imports: [],
            types: [],
            description: definitions[interfaceName].description
        };
        switch (definitions[interfaceName].type) {
            case 'object':
                definitions[interfaceName].properties && Object.keys(definitions[interfaceName].properties).forEach(property => {
                    const types = formatTypes(definitions[interfaceName].properties[property]);
                    const isRequired = definitions[interfaceName].required
                        && definitions[interfaceName].required.includes(property);
                    types.model
                        && types.model.length
                        && model.imports.push(...types.model);
                    model.types.push({
                        ...types,
                        name: property,
                        isOption: !!isRequired
                    });
                    models.push(model);
                });
                break;
        }
    });
    return models;
}
function converDefinitionProperty(definitionProperty) {
    return definitionProperty.replace(/\W+$/, '').replace(/\W+/g, '_');
}
function formatTypes(object) {
    if (object.$ref) {
        const model = formatRefsLink(object.$ref);
        return {
            type: model,
            model: [model],
            description: object.description
        };
    }
    switch (object.type) {
        case 'number':
        case 'integer':
            return { type: 'number', description: object.description };
        case 'string':
            return {
                type: object.enum ? formatStringEnums(object.enum) : 'string',
                description: object.description
            };
        case 'array':
            return formatArrayTypes(object);
        case 'boolean':
            return {
                type: 'boolean',
                description: object.description
            };
        case 'object':
            return {
                type: "Record<string, any>",
                description: object.description
            };
        case 'file':
            return {
                type: "File",
                description: object.description
            };
    }
}
function formatRefsLink(ref) {
    return converDefinitionProperty(ref.split('#/definitions/')[1]);
}
function formatStringEnums(strintEnum) {
    return strintEnum.reduce((a, b) => a ? `${a} | '${b}'` : `'${b}'`, '');
}
function formatArrayTypes(typeObject) {
    const { type, model } = formatTypes(typeObject.items);
    return {
        type: `Array<${type}>`,
        description: typeObject.description,
        model: model || []
    };
}

function getControllers(tags) {
    const controllerMap = {};
    tags.forEach(tag => {
        controllerMap[tag.name] = {
            name: getServiceName(tag.name),
            description: tag.description,
            imports: [],
            requests: []
        };
    });
    return controllerMap;
}
function convertService(swagger) {
    let controllerMap = getControllers(swagger.tags);
    const paths = Object.keys(swagger.paths);
    paths.forEach(path => getServiceMapData(path, swagger, controllerMap));
    return Object.values(controllerMap).map(service => {
        service.imports = Array.from(new Set(service.imports));
        return service;
    });
}
function getServiceMapData(path, swagger, controllerMap) {
    const methods = swagger.paths[path];
    Object.keys(methods).forEach(method => {
        const methodWrapper = methods[method];
        if (controllerMap[methodWrapper.tags[0]]) {
            const tag = controllerMap[methodWrapper.tags[0]];
            const { parametersRecord, imports, parameters } = getParameters(methodWrapper.parameters);
            tag.imports.push(...(imports || []));
            const response = getResponseType(methodWrapper.responses);
            typeof response !== 'string' && tag.imports.push(...(response.model || []));
            const request = {
                method: method.toUpperCase(),
                description: methodWrapper.summary,
                url: `${path.replace(/\{(.+)\}/, '${$1}')}`,
                name: methodWrapper.operationId,
                responseType: typeof response !== 'string'
                    ? response.type : response,
                ...parametersRecord,
                parameters,
            };
            tag.requests.push(request);
        }
    });
}
function getServiceName(name) {
    const stringNew = name.split('-')
        .map(stringItem => stringItem.replace(stringItem[0], stringItem[0].toUpperCase())).join('');
    return stringNew.endsWith('Service') ? stringNew : stringNew + 'Service';
}
function getResponseType(responses) {
    return responses['200'] && responses['200'].schema ? formatTypes(responses['200'].schema) : 'any';
}
function getParameters(parameters) {
    if (!parameters)
        return {};
    const parametersRecord = {};
    let imports = [];
    const params = parameters.map(parameter => {
        if (!parametersRecord[parameter.in])
            parametersRecord[parameter.in] = [];
        const { type, model, description } = formatTypes(parameter.schema || parameter);
        if (model) {
            imports.push(...model);
        }
        const param = {
            name: parameter.name,
            type,
            imports: model,
            isOption: parameter.required,
            description: parameter.description
        };
        parametersRecord[parameter.in].push(param);
        return param;
    });
    return {
        parametersRecord,
        parameters: params,
        imports
    };
}

async function main({ url, output, requestPath }) {
    const [res, templates] = await Promise.all([
        fetchApiJson(url),
        getTemplates()
    ]);
    let folder = path__namespace.join(process.cwd(), output || '/api');
    if (res) {
        const isExists = await fs__namespace.pathExistsSync(folder);
        if (isExists) {
            await fs__namespace.removeSync(folder);
        }
        await fs__namespace.mkdirsSync(folder);
        if (!requestPath) {
            writeRequest(templates, folder);
        }
        try {
            await Promise.all([
                writeInterfaces(convertModels(res.definitions), templates, folder),
                writeServices(convertService(res), templates, folder, requestPath || '../request')
            ]);
        }
        catch (err) {
            console.error('write models and service error: ', err);
        }
        writeExports(templates, folder);
    }
}
async function writeExports(templates, folder) {
    const [models, services] = await Promise.all([
        fs__namespace.readdirSync(folder + '/models'),
        fs__namespace.readdirSync(folder + '/services')
    ]);
    if (!models.length && !services.length)
        return;
    await writeIndex(models.map(model => './models/' + model).concat(...services.map(service => './services/' + service)), templates, folder);
}

exports.main = main;
exports.writeExports = writeExports;
