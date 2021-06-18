declare  const templates: Partial<Record< 'index' | 'model' | 'service' | 'request' | 'request.d', string>>
declare module '*.mustache' {
  const value: string
  export default value
}