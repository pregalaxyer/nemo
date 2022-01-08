import { Definition, Items, Parameter } from '../types'
import * as Types from './index.d'

/**
 * fix property with - in object bugs
 */
export const propertyGetter: (property: string) => string = property => /\-/g.test(property) ? `'${property}'` : property

/**
 * @param {definitions} swagger definitions
 */
export function convertModels(definitions: Record<string, Definition> ): Types.Model[] {
  const models: Types.Model[] = []
  const interfaceNames = Object.keys(definitions)
  interfaceNames.forEach(interfaceName => {
    const modelName = convertDefinitionProperty(definitions[interfaceName].title || interfaceName)
    const model: Types.Model = {
      name: modelName,
      imports: [],
      types: [],
      description: definitions[interfaceName].description,
      extends: undefined
    }
    switch(definitions[interfaceName].type) {
      case 'object':
        objectHandler(definitions[interfaceName], model, modelName)
        models.push(model)
        break
      case 'allOf':
        allOfHandler(definitions[interfaceName], model, modelName)
        models.push(model)
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
export function convertDefinitionProperty(definitionProperty: string): string {
  return definitionProperty.replace(/\W+$/, '').replace(/\W+/g, '_')
}
/**
 * @description Models with Composition
 * transform with typescript extends keywords
 */
export function allOfHandler(definition: Definition, model: Types.Model, modelName: string) {
  const extendModels: string[] = []
  definition.allOf.forEach(definition => {
    if (definition.$ref) {
      const name = formatRefsLink(definition.$ref)
      if (!extendModels.includes(name)) {
        extendModels.push(name)
      }
    }else {
      objectHandler(definition, model, modelName)
    }
  })
  if (extendModels.length) model.extends = extendModels.join(',')
  model.imports = model.imports.concat(extendModels.filter(type => !model.imports.includes(type)))
}
/**
 *
 * @param object
 * @returns
 */
export function objectHandler(definition: Definition, model:  Types.Model, modelName: string) {
  definition.properties && Object.keys(
    definition.properties
  ).forEach(
    property => {
      const types = formatTypes(definition.properties[property])
      const isRequired = definition.required
        && definition.required.includes(property)
      types.model
        && types.model.length
        && model.imports.push(...types.model.filter(name => name !== modelName))
      model.imports = Array.from(new Set(model.imports))
      model.types.push({
        ...types,
        name: propertyGetter(property),
        isOption: !isRequired
      })

    }
  )
}
/**
 * @param { object} types object
 */
export function formatTypes(object: Definition | Parameter): {
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
      return formatArrayTypes(object as Definition)
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
    case 'file':
      return {
        type: "File",
        description: object.description
      }
  }
}
export function formatRefsLink(ref: string): string {
  return convertDefinitionProperty(ref.split('#/definitions/')[1])
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
