import { Swagger, Tag, Path, SwaggerResponses, Parameter, ParameterIn } from '../types'
import { ServiceController,  } from './index.d'
import { formatRefsLink, formatTypes } from '../interfaces'
import { TypeItem } from '../interfaces/index.d'
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


function getServiceMapData(
  path: string,
  swagger:Swagger,
  controllerMap:  Record<string, ServiceController>
) {
  const methods = swagger.paths[path]
  Object.keys(methods).forEach(method => {
    const methodWrapper = methods[method]
    if (controllerMap[methodWrapper.tags[0]]) {
      const tag = controllerMap[methodWrapper.tags[0]]
      // here we need to notice not like body, formData, path, query should
      // be a collection types
      // eg: body: `{ key: type, key1: type1} `
      // query formData path: `key: type, key1: type1`
      const {
        parametersRecord,
        imports,
        parameters,
        hasQuery,
        hasBody,
        hasFormData
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
        name: methodWrapper.operationId,
        responseType:
          typeof response !== 'string'
          ? response.type : response,
        ...parametersRecord,
        parameters,
        hasQuery,
        hasBody,
        hasFormData
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
    const param = {
      name: parameter.name,
      type,
      imports: model,
      isOption: parameter.required,
      description: parameter.description
    }
    parametersRecord[parameter.in].push(param)
    return param
  })
  return {
    parametersRecord,
    parameters: params,
    imports,
    hasQuery: !!parametersRecord.query && parametersRecord.query.length > 0,
    hasBody: !!parametersRecord.body && parametersRecord.body.length > 0,
    hasFormData: !!parametersRecord.formData && parametersRecord.formData.length > 0
  }
}
