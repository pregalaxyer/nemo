
/**
 * @description swagger types
 */
type Type = 'object' | 'integer' | 'number' | 'string' | 'array' | 'boolean'
export interface Items {
  type: string
  $ref: string
  enum: string[]
  format: string
}
export interface Definition {
  type: Type
  description: string
  required?: string[]
  properties?: Record<string, Definition>
  additionalProperties?: Definition
  format?: string
  items?: Partial<Items>,
  $ref?: string
  enum?: string[]
  title: string
}

interface SwaggerInfo {
  description: string
  version: string
  title: string
}
export interface Swagger {
  swagger: string
  info?: SwaggerInfo
  host: string
  basePath: string
  tags: Tag[]
  paths: Path
  definitions: Record<string, Definition>
}
export type ParameterIn = 'body' | 'query' | 'path' | 'formData'
interface Parameter {
  in: ParameterIn
  name: string
  description?: string
  required?: boolean
  schema?: Partial<Definition>
}
type ResponseCode = '200' | '400' | '405' | '404' | '405'
type SwaggerResponses  = Partial<
  Record<ResponseCode,
  {
    description: string
    schema?: Partial<Definition>
  }>
>
interface BaseRequestPath {
  tags: string[]
  summary: string
  operationId: string
  consumes?: string[]
  produces?: string[]
  parameters: Parameter []
  responses: SwaggerResponses
}
type Method = 'post' | 'get' | 'put' | 'delete' | 'head'
export type Path = Partial<Record<Method, BaseRequestPath>>


export interface Tag {
  name: string
  description: string
  externalDocs?: {
    description: string
    url: string
  }
}
