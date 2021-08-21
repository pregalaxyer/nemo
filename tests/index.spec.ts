// TODO for lib test

import  main from '../esm/index'
import fs from 'fs-extra'
import path from 'path'

test('lib excute', async () => {
  await main({
    url: 'https://openapi-gateway-dev.ocjfuli.com/openapigw/app/crm/v2/api-docs',
    output: './tests/.output',
    requestPath: null,
    paths: undefined,
    exportsRequest: true
  })

  const [models, services] = await Promise.all([
    fs.readdirSync(path.resolve(__dirname, '.output/models')),
    fs.readdirSync(path.resolve(__dirname,'.output/services'))
  ])
  expect(models).toBeDefined()
  expect(services).toBeDefined()

})
