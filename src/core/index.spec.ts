import main from './index'
import { fetchApiJson, writeRequest, handlePaths,  writeServices, writeInterfaces, writeExport, registerTemplates} from './utils'

jest.mock('fs-extra', () => {
  return {
    _isEsModule: true,
    writeFileSync: jest.fn(() => {}),
    pathExistsSync: jest.fn().mockReturnValue(true),
    removeSync: jest.fn(),
    mkdirsSync: jest.fn(),
    readdirSync: jest.fn().mockImplementation(async(path) => {
      const arr = String(path).indexOf('models') ? ['./models/index.ts'] : ["./services/index.ts"]
      return arr
    })
  };
});
jest.mock('./utils', () => ({
  _esModule: true,
  fetchApiJson: jest.fn().mockImplementation(async (url) => {
    const fetch = require('node-fetch')
    const res = await fetch(url).then(res => res.json())
    return res
  }),
  handlePaths: jest.fn().mockReturnValue({
    models: [
      {
        name: 'test',
      }
    ],
    services: [
      {
        name: 'test'
      }
    ]
  }),
  registerTemplates: jest.fn().mockReturnValue({
    index: 'index',
    serverice: 'service',
    request: 'request',
    model: 'models',
    utils: 'utils'
  }),
  writeServices: jest.fn(async(a, b,c,d) => {

  }).mockImplementation(),
  writeInterfaces: jest.fn(async(a, b,c) => {

  }).mockImplementation(),
  writeRequest: jest.fn(async(a, b,c) => {

  }).mockImplementation(),
  writeIndex: jest.fn(async(a, b,c) => {

  }),
  writeExport: jest.fn().mockImplementation(async(a, b) => {

  })

}))
describe('main function', () => {
  
  test('definitions should create all interface files', async () => {
      await main({
        url: 'https://petstore.swagger.io/v2/swagger.json',
        output: './src/core/test',
        requestPath: null,
        exportsRequest: true
      })
      expect(fetchApiJson).toHaveBeenCalledTimes(1)
      expect(fetchApiJson).toHaveBeenCalledWith('https://petstore.swagger.io/v2/swagger.json')
      expect(handlePaths).toHaveBeenCalledTimes(1)
      expect(registerTemplates).toHaveBeenCalledTimes(1)
      expect(writeServices).toHaveBeenCalledTimes(1)
      expect(writeInterfaces).toHaveBeenCalledTimes(1)
      expect(writeRequest).toHaveBeenCalledTimes(1)
      expect(writeExport).toHaveBeenCalledTimes(1)
    })
  
})

