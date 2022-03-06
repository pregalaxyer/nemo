/**
 * * Swagger V3
 * @notice https://editor.swagger.io/?_ga=2.129656330.728723237.1624434404-1915285820.1624243698
 * convert api json to v3
 * * requestBody -> parameters in body & formData content (nested in media type object)
 * * parameters -> parameters in query
 * * responses -> responses object (nested in media type object)
 * * definitions -> components[schemas]
 * * schemas required outside handler
 */
import { Swagger, Tag, Path, SwaggerResponses, Parameter, ParameterIn } from '../types'
import { ServiceController,  } from './index.d'
import { formatTypes, propertyGetter } from '../interfaces'
import { TypeItem } from '../interfaces/index.d'
import { VARIABLES_ILLEGAL_REG } from '../utils/const'

/**
 * A list of tags used by the specification with additional metadata.
 * The order of the tags can be used to reflect on their order by the parsing tools.
 * Not all tags that are used by the Operation Object must be declared.
 * The tags that are not declared may be organized randomly or based on the tools' logic.
 * Each tag name in the list MUST be unique.
 * @param tags use tag unique name as service filename
 * @returns service file maps
 */
export function getControllers(tags: Tag[]): Record<string, ServiceController> {
  const controllerMap: Record<string, ServiceController> = {}
  tags.forEach(tag => {
    controllerMap[tag.name] = {
      name: getServiceName(tag.name),
      description: tag.description,
      imports: [],
      requests: []
    }
  })
  return controllerMap
}
/**
 * we get service controller data from swagger specification
 * https://swagger.io/specification
 * @param swagger
 * @returns ServiceController
 */
export function convertService(swagger: Swagger): ServiceController[] {
  let controllerMap = getControllers(swagger.tags)
  const paths = Object.keys(swagger.paths)
  // get service template data one by one
  paths.forEach(path => getServiceMapData(path, swagger, controllerMap ))
  return Object.values(controllerMap).map(service => {
    service.imports = Array.from(new Set(service.imports))
    return service
  })
}

export function handlerBasePath(path: string): string {
  return path === '/' || !path ? '' : path
}


export function getServiceMapData(
  path: string,
  swagger:Swagger,
  controllerMap:  Record<string, ServiceController>
) {
  const methods = swagger.paths[path]
  Object.keys(methods).forEach(method => {
    const methodWrapper = methods[method]
    if (controllerMap[methodWrapper.tags[0]]) {
      const tag = controllerMap[methodWrapper.tags[0]]
      const {
        parametersRecord,
        imports,
        parameters,
      } = getParameters(methodWrapper.parameters)
      tag.imports.push(...(imports || []))
      // get responsetype
      const response = getResponseType(methodWrapper.responses)
      // add import modules
      typeof response !== 'string' && tag.imports.push(...(response.model || []))
      const request = {
        method: method.toUpperCase(),
        description: methodWrapper.summary,
        url: `${path.replace(/\{(.+)\}/, '${$1}')}`,
        name: methodWrapper.operationId.replace(/\_\d+$/, ''),
        responseType:
          typeof response !== 'string'
          ? response.type : response,
        ...parametersRecord,
        parameters,
      }
      tag.requests.push(request)
    }
  })
}


export function getServiceName(name: string): string {
  const stringNew = name.split('-')
  .map(
    stringItem => stringItem.replace(
      stringItem[0],
      stringItem[0].toUpperCase()
    )
  ).join('')
  return stringNew.endsWith('Service') ? stringNew : stringNew + 'Service'
}

export function getResponseType(responses: SwaggerResponses){
  return responses['200'] && responses['200'].schema ? formatTypes(responses['200'].schema) : 'any'
}

export const createAlias = (name: string): string | undefined => name.search(VARIABLES_ILLEGAL_REG) > - 1 ? name.replace(VARIABLES_ILLEGAL_REG, '_') : undefined

/**
* here we need to notice not like body, formData, path, query should
* be a collection types
* eg: body: `{ key: type, key1: type1} `
* query formData path: `key: type, key1: type1`
* *notice schema: https://swagger.io/specification/v2/#parameterObject
*
 */
export function getParameters(
  parameters:Parameter[]
): {
  parametersRecord?: Partial<Record<ParameterIn, TypeItem[]>>
  imports?: string[]
  parameters?: TypeItem[]
  hasQuery?: boolean
  hasBody?: boolean
  hasFormData?: boolean
 } {
  if (!parameters) return {}
  const parametersRecord: Partial<Record<ParameterIn, TypeItem[]>> = {}
  let imports: string [] = []
  const params = parameters.map(parameter => {
    if(!parametersRecord[parameter.in]) parametersRecord[parameter.in] = []
    const {type, model, description} = formatTypes(
      parameter.schema || parameter
    )
    // add imports
    if (model) {
      imports.push(...model)
    }
    const param: TypeItem = {
      alias: createAlias(parameter.name),
      name: propertyGetter(parameter.name),
      type,
      imports: model,
      isOption: !parameter.required,
      description: parameter.description,

    }
    parametersRecord[parameter.in].push(param)
    return param
  }).sort((a, b) => Number(!!a.isOption) - Number(!!b.isOption)) // optional params append at the tail
  return {
    parametersRecord,
    parameters: params,
    imports,
  }
}
