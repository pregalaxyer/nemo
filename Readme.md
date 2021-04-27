<h1 style="text-align: center">nemo🐠</h1>
<p> a 💪 typescript generator 🔨 for swagger resultful api, based on swagger v2 </p>

<img src="https://img.shields.io/travis/com/diveDylan/nemo?style=plastic"/>
<img src="https://img.shields.io/codecov/c/github/diveDylan/nemo?style=plastic"/>
<img src="https://img.shields.io/npm/types/typescript"/>
<img src="https://img.shields.io/badge/compiler-rollup-brightgreen"/>
<img src="https://img.shields.io/badge/template-mustache-brightgreen">

## Installing
```node
  npm install @dylan92/nemo
```

## Exmaple
exceut the file below, your will get your swagger typescript files.
<b>options</b>:
  
  1. `url`: your resultful swagger json url
  2. `output`: the folder for your swagger typescript files
  3. `requestPath`: customer request, such as `axios` or `umi-request`
  4. `exportsRequest`: the options for your to decide wether create request folder, always happened when you want save local fetch changes

```node
const main = require('@nemo')

main({
  url: 'https://petstore.swagger.io/v2/swagger.json',
  output: './src/core/test'
})

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


