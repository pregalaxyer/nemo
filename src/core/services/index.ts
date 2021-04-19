import { Swagger, Tag, Path, SwaggerResponses, Parameter, ParameterIn } from '../types'
import { ServiceController,  } from './index.d'
import { formatRefsLink, formatTypes } from '../interfaces'
import { TypeItem } from '../interfaces/index.d'
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

export function convertService(swagger: Swagger): ServiceController[] {
  let controllerMap = getControllers(swagger.tags)
  // TODO: convertPaths here
  const paths = Object.keys(swagger.paths)
  paths.forEach(path => {
    const methods = swagger.paths[path]
    Object.keys(methods).forEach(method => {
      const methodWrapper = methods[method]
      if (controllerMap[methodWrapper.tags[0]]) {
        const tag = controllerMap[methodWrapper.tags[0]]
        // here we need to notice not like body, formData, path, query should
        // behaviour like something scattered
        // eg: body: `{ key: type, key1: type1} `
        //  query formData path: `key: type, key1: type1`
        const params = getParameters(methodWrapper.parameters)
        let parameters: TypeItem[] = []
        Object.values(params)
          .forEach(param => {
            param.forEach(paramType => {
              if (paramType.imports) {
                tag.imports.push(...paramType.imports)
              }
              parameters.push(paramType)
            })
          });
        const response = getResponseType(methodWrapper.responses)
        typeof response !== 'string' && tag.imports.push(...(response.model || []))
        const request = {
          method,
          description: methodWrapper.summary,
          url: `${path.replace(/\{(.+)\}/, '${$1}')}`,
          name: methodWrapper.operationId,
          responseType:
            typeof response !== 'string'
            ? response.type : response,
          ...params,
          parameters,
        }
        tag.requests.push(request)
      }
    })
  })
  return Object.values(controllerMap).map(service => {
    service.imports = Array.from(new Set(service.imports))
    return service
  })
}

export function getServiceName(name: string): string {
  const stringNew =  name.split('-')
  .map(
    stringItem => stringItem.replace(
      stringItem[0],
      stringItem[0].toUpperCase()
    )
  ).join('')
  return stringNew.endsWith('Service') ? stringNew : stringNew + 'Service'
}

export function getResponseType(responses: SwaggerResponses){
  return responses['200'] && responses['200'].schema ? formatTypes(responses['200'].schema) : 'void'
}

export function getParameters(
  parameters:Parameter[]
): Partial<Record<ParameterIn, TypeItem[]>> {
  if (!parameters) return {}
  const parametersObj: Partial<Record<ParameterIn, TypeItem[]>> = {}
  parameters.forEach(parameter => {
    if(!parametersObj[parameter.in]) parametersObj[parameter.in] = []
    const {type, model, description} = formatTypes(
      parameter.schema || parameter
    )
    parametersObj[parameter.in].push({
      name: parameter.name,
      type,
      imports: model,
      isOption: parameter.required,
      description: parameter.description
    })
  })
  return parametersObj
}
