/**
 * @description swagger types
 * @url https://swagger.io/specification/v2
 */
export type Type =
  | 'object'
  | 'integer'
  | 'number'
  | 'string'
  | 'array'
  | 'boolean'
export interface HeadersObject extends Items {
  description: string
}

export interface Schema extends Partial<Items> {
  required: string[]
  description: string
  allOf: Definition[]
  // see the schema: https://openapi.apifox.cn/#schema-%E5%AF%B9%E8%B1%A1
  anyOf: Definition[]
  oneOf: Definition[]
  not: Definition[]
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
export interface Definition extends Partial<Schema> {}
type License = Pick<Tag, 'name'> & {
  url: string
}

interface Contact extends License {
  email: string
}
interface Info extends License {
  title: Definition.title
  license?: License
  termsOfService?: string
  contact?: Contact
}

type SecuritySchema = Pick<Schema, 'type' | 'description' | 'name' | 'in'> & {
  flow: string
  authorizationUrl: string
  tokenUrl: string
  scopes: string
}

type externalDocs = {
  url: string
  description: string
}
export interface Swagger {
  swagger: string
  info?: Info
  host: string
  basePath: string
  schemes?: string[]
  consumes?: string[]
  produces?: string[]
  tags: Tag[]
  paths: Record<string, Path>
  definitions: Record<string, Definition>
  additionalProperties: Record<string, Schema>
  parameters: Record<string, Parameter>
  securityDefinitions?: Record<string, Partial<SecuritySchema>>
  security?: Record<string, string[]>
  externalDocs?: ExternalDocs
  responses: Record<string, Response>
}

export type SwaggerV3 = Pick<Swagger, 'info' | 'tags'> &  {

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
type SwaggerResponses = Partial<Record<ResponseCode, Response>>

interface BaseRequestPath {
  tags: string[]
  summary: string
  operationId: string
  consumes?: string[]
  produces?: string[]
  parameters: Parameter[]
  responses: SwaggerResponses
  externalDocs?: Pick<Tag, 'externalDocs'>
  schemes: string[]
  deprecated: boolean
  security?: Record<string, string[]>
}
export type Method =
  | 'post'
  | 'get'
  | 'put'
  | 'delete'
  | 'head'
  | 'options'
  | 'patch'
  | 'trace'
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
