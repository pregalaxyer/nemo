export interface SwaggerConfig {
  /**
   * @description swagger api url
   */
  url: string
  /**
   * @description single-api or apis
   */
  paths?: Array<string | RegExp>
  /**
   * @description output floder
   */
  output?: string
  /**
   * @description where request module import from
   */
  requestPath?: string
  /**
   * @description request templates only create and remove when it is true
   * when you only need exportsRequest once, mostly code likes:
   * * `exportsRequest: !isRequestFloderExsit`
   */
  exportsRequest?: boolean
}
