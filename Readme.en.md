
[简体中文](Readme.zh.md)

<h1 style="text-align: center">nemo🐠</h1>

<div  style="text-align: center">
<img src="https://img.shields.io/npm/v/@pregalaxyer/nemo?color=%23&style=plastic" />
<img src="https://img.shields.io/npm/l/@pregalaxyer/nemo" />
<img src="https://img.shields.io/github/workflow/status/pregalaxyer/nemo/Pull%20Request"/>
<img src="https://img.shields.io/codecov/c/github/pregalaxyer/nemo?style=plastic"/>
<img src="https://img.shields.io/npm/dm/@pregalaxyer/nemo?style=plastic">
<img src="https://img.shields.io/badge/pkg--manage-pnpm-orange">
</div>

<p  style="text-align: center"> a 💪 typescript generator 🔨 for swagger resultful api, based on swagger v2 </p>




## Install

```node
  npm install @pregalaxyer/nemo
  // or
  yarn add @pregalaxyer/nemo
  // install global
  npm install @pregalaxyer/nemo -g
```

## Example
excute the file below, your will get your swagger typescript files.
<b>options</b>:
  
  1. `url`: your resultful swagger json url
  2. `output`: the folder for your swagger typescript files
  3. `requestPath`: customer request, such as `axios`, `umi-request` or file path
  4. `exportsRequest`: the options for your to decide wether create request folder, always happened when you want save local fetch changes
  5. `paths`: exports by paths filter

```typescript

interface SwaggerConfig {
  /**
   * @description swagger api url
   */
  url: string
  /**
   * @description single-api or apis
   */
  paths?: Array<string | Regexp>
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
```
`swagger.js`
```node
const main = require('@pregalaxyer/nemo')

// with esm
import main from '@pregalaxyer/nemo'

main({
  url: 'https://petstore.swagger.io/v2/swagger.json',
  output: './src/api'
})

```

**Terminal Bash**

``` bash
@pregalaxyer/nemo convert -i https://petstore.swagger.io/v2/swagger.json -o ./src/api
# or after install global
npx @pregalaxyer/nemo convert -i https://petstore.swagger.io/v2/swagger.json -o ./src/api

```

## Change request library
It easy for you to use other request library. Example:

```typescript
type RequestInitWithoutBodyInit = Omit<RequestInit, 'body'>

interface Options extends RequestInitWithoutBodyInit, Record<string, any> {
  body?: Record<string, any>
  formData?: Record<string, any>
  query?: Record<string, any>
}
// default request
request<ResponseType>(url: string, options: Options)


// your request file
import request from `${library}`
import { getRequestBody, Options  } from `${output}/utils`

export default async function <T>(url, options) {
  const body: BodyInit | undefined = getRequestBody(options)
  const data = await request<T>(url, Object.assign(options, {body}))
  return data
}
```






## TODO
- [ ] swagger v3 support


