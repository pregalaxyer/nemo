
import * as Child_process  from 'child_process'

import * as path from 'path'

import fs from 'fs-extra'

const { exec, execSync } = Child_process
const binPath = path.resolve(__dirname, './index.js')
const cmd = `node ${binPath}`

describe('nemo bin usage test', () => {
  test('miss required option', () => {
    exec(cmd + ' convert', (err) => {
      expect(err).toBeDefined()
    })
  })

  test('convert schema to typescript file', async () => {
    execSync(cmd + ' -i https://petstore.swagger.io/v2/swagger.json -o ./bin/.output')
    const [models, services] = await Promise.all([
      fs.readdirSync(path.resolve(__dirname, '.output/models')),
      fs.readdirSync(path.resolve(__dirname,'.output/services'))
    ])
    expect(models).toBeDefined()
    expect(services).toBeDefined()
  })


})


