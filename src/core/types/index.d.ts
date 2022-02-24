
/**
 * @description swagger types
 * @url https://swagger.io/specification/v2
 */
export type Type = 'object' | 'integer' | 'number' | 'string' | 'array' | 'boolean'
export interface HeadersObject extends Items {
  description: string
}

export interface Schema extends Partial<Items> {
  required: string[]
  description: string
  allOf: Definition[]
  title: string
  properties: Record<string, Partial<Schema>>

}
export interface Items {
  type: string
  $ref: string
  enum: string[]
  format: string
  items: Partial<Items>
  collectionFormat: string
  default: any
  maximum: number
  exclusiveMaximum: boolean
  minimum: number
  exclusiveMinimum: boolean
  maxLength: number
  minLength: number
  pattern: string
  maxItems: number
  minItems: number
  uniqueItems: boolean
  enum: any[]
  multipleOf: number
  additionalProperties: Record<string, Schema>
}
export interface Definition extends Partial<Schema>{
}
type LicenseObject = Pick<Tag, 'description' | 'name'>

interface ContactObject extends LicenseObject {
  email: string
}
interface SwaggerInfo extends LicenseObject   {
  title: Definition.title
  license?: LicenseObject
  termsOfService?: string
  contact?: ContactObject
}
export interface Swagger {
  swagger: string
  info?: SwaggerInfo
  host: string
  basePath: string
  schemes?: string[]
  consumes?: string[]
  produces?: string[]
  tags: Tag[]
  paths: Record<string, Path>
  definitions: Record<string, Definition>
  additionalProperties: Record<string, Schema>
}
export type ParameterIn = 'body' | 'query' | 'path' | 'formData' | 'header'
export interface Parameter extends Partial<Items> {
  in: ParameterIn
  name: string
  description?: string
  required?: boolean
  schema?: Partial<Definition>
}
type ResponseCode = '200' | '400' | '405' | '404' | '405'
interface Response {
  description: string
  examples?: Record<string, any>
  headers: HeadersObject
  schema?: Partical<Schema>
}
type SwaggerResponses  = Partial<
  Record<ResponseCode,
  Response>
>

interface BaseRequestPath {
  tags: string []
  summary: string
  operationId: string
  consumes?: string[]
  produces?: string[]
  parameters: Parameter []
  responses: SwaggerResponses
  externalDocs?: Pick<Tag, 'externalDocs'>
  schemes: string[]
  deprecated: boolean
  security?: Record<string, string[]>
}
export type Method = 'post' | 'get' | 'put' | 'delete' | 'head' | 'options' | 'patch' | 'trace'
export interface Path extends Partial<Record<Method, BaseRequestPath>> {
  $ref: Items.$ref
  parameters: Array<Parameter | Reference>
}

interface Reference {
  $ref: Items.$ref
}


export interface Tag {
  name: string
  description: string
  externalDocs?: ExternalDocs
}

export interface ExternalDocs {
  description: string
  url: string
}
