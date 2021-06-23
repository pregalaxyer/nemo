<h1 style="text-align: center">nemo🐠</h1>
<p> a 💪 typescript generator 🔨 for swagger resultful api, based on swagger v2 </p>

[简体中文](Readme.zh.md)

<div>
<img src="https://img.shields.io/npm/v/@dylan92/nemo?color=%23&style=plastic" />
<img src="https://img.shields.io/travis/com/diveDylan/nemo?style=plastic"/>
<img src="https://img.shields.io/codecov/c/github/diveDylan/nemo?style=plastic"/>
<img src="https://img.shields.io/npm/dw/@dylan92/nemo?style=plastic">

</div>

## Installing
```node
  npm install @dylan92/nemo
  // or
  yarn add @dylan92/nemo
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
  paths?: string[]
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
```node
const main = require('@dylan92/nemo')

main({
  url: 'https://petstore.swagger.io/v2/swagger.json',
  output: './src/core/test'
})

```
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
import fetch from `${library}`
import { getRequestBody, Options  } from `${output}/utils`

export default async function request<T>(url, options) {
  const body: BodyInit | undefined = getRequestBody(options)
  const data = await request<T>(url, Object.assign(options, {body}))
  return data
}
```



## AbortController
We takes [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) as a important parameters for fetch or other xhr request.
It become more clear when you are a react hooks user.
```js
// react.js
// thinks your have two tabs: tabA, tabB
// when you forgot abortcontroller
fetchList({
  tab: tabName
}).then(res => setList(res.list))
// change to tabB from tabA, tabA has lowsql or cost more times
// step one: in tabA, expect tabAList
fetchList({
  tab: tabA
})
// step two: in tabB, expect tabBList
fetchList({
  tab: tabB
})
// after all, list is tabAList
fetchList({
  tab: tabName
}, abortControllerSignal)
// when change tab
abortController.abort()
```









## TODO
- [ ] terminal tool
- [ ] bin tests
- [ ] swagger v3 support


