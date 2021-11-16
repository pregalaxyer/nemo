
[English](Readme.en.md)

<h1 style="text-align: center">nemo🐠</h1>
<div style="text-align: center">
<img src="https://img.shields.io/npm/v/@dylan92/nemo?color=%23&style=plastic" />
<img src="https://img.shields.io/npm/l/@dylan92/nemo" />
<img src="https://img.shields.io/travis/com/diveDylan/nemo?style=plastic"/>
<img src="https://img.shields.io/codecov/c/github/diveDylan/nemo?style=plastic"/>
<img src="https://img.shields.io/npm/dm/@pregalaxyer/nemo?style=plastic">
<img src="https://img.shields.io/badge/pkg--manage-pnpm-orange">
</div>
<p style="text-align: center"> 
一个自动化生成 <code>swagger typescript</code> 文件的💪工具，基于 <code>swagger V2</code>
</p>


## 安装

```node
  npm install @pregalaxyer/nemo
  // or
  yarn add @pregalaxyer/nemo
```

## 构建

```zsh
# https://github.com/grosser/wwtd
gem install wwtd
# then
wwtd

```




## 用法

### 参数:
  
  1. `url`: `swagger` 项目的 `api json` 地址
  2. `output`: `typescript` 文件的输出目录
  3. `requestPath`: 第三方请求库，如果需要自定义请求
  4. `exportsRequest`: 是否需要再次输出请求目录
  5. `paths`: 路径，用于输出制定路径的文件

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
在你的项目新建一个 `swagger.js` 文件，复制一下代码，然后 `node swagger.js`，脚本会自动生成 `models`、`services` 目录和一个导出文件
```node
// swagger.js
const main = require('@pregalaxyer/nemo')

// with esm
import main from '@pregalaxyer/nemo'

main({
  url: 'https://petstore.swagger.io/v2/swagger.json',
  output: './src/core/test'
})

```
只需要两分钟即可接入第三方库，你需要大概了解入参的 `interface` ，然后书写转换一个简易转换函数即可开箱即用

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
// 你的转换函数
export default async function <T>(url, options) {
  const body: BodyInit | undefined = getRequestBody(options)
  const data = await request<T>(url, Object.assign(options, {body}))
  return data
}
```


