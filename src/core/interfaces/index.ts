import { Definition } from '../types'
import * as Types from './type'


const numberTypes = ['number', 'interge']
/**
 * @param {definitions} swagger definitions
 */
export function convertModels(definitions: { [key: string]: Definition } ): Types.Model[] {
  const models: Types.Model[] = []
  const interfaceNames = Object.keys(definitions)
  interfaceNames.forEach(interfaceName => {
    const model: Types.Model = {
      name: converDefinitionProperty(definitions[interfaceName].title || interfaceName),
      imports: [],
      types: [],
      description: definitions[interfaceName].description
    }
    switch(definitions[interfaceName].type) {
      case 'object':
        definitions[interfaceName].properties && Object.keys(
          definitions[interfaceName].properties
        ).forEach(
          property => {
            const types = formatTypes(definitions[interfaceName].properties[property])
            types.model
              && types.model.length
              && model.imports.push(...types.model)
            model.types.push({
              ...types,
              name: property,
            })
            models.push(model)
          }
        )
        break
    }
  })
  return models
}
/**
 * 
 * @param { definitionProperty } the definitionName 
 * @returns format string join with '_'
 */
export function converDefinitionProperty(definitionProperty: string): string {
  return definitionProperty.replace(/\W+$/, '').replace(/\W+/g, '_')
}

/**
 * @param { object} types object
 */
export function formatTypes(object): {
  type: string
  model?: string[]
  description: string
} {

  if (object.$ref) {
    const model = formatRefsLink(object.$ref)
    return {
      type: model,
      model: [model],
      description: object.description
    }
  }
  switch(object.type) {
    case 'number':
    case 'integer':
      return { type: 'number', description: object.description}
    case 'string': 
      return {
        type: object.enum ? formatStringEnums(object.enum) : 'string',
        description: object.description
      }
    case 'array':
      return formatArrayTypes(object)
    case 'boolean':
      return {
        type: 'boolean',
        description: object.description
      }
    case 'object':
      return {
        type: "Record<string, any>",
        description: object.description
      }
  }
}
export function formatRefsLink(ref: string): string {
  return converDefinitionProperty(ref.split('#/definitions/')[1])
}

/**
 * @params { string [] } 字符串枚举
 * @return { string }
 */
export function formatStringEnums(strintEnum: string []): string {
  return strintEnum.reduce((a, b) => a ? `${a} | '${b}'` : `'${b}'`, '')
}
export function formatArrayTypes(typeObject: Definition){
  const { type, model} = formatTypes(typeObject.items)
  return {
    type: `Array<${type}>`,
    description: typeObject.description,
    model: model || []
  }
}