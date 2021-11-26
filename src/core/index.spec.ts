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
    if (url ) {
      const fetch = require('node-fetch')
      const res = await fetch(url).then(res => res.json())
      return res
    }else {
      return false
    }

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
  fixedEncodeURI: jest.fn().mockImplementation(url => url),
  writeServices: jest.fn(async(a, b,c,d) => {
    if (d === 'error') {
      throw 2
    }
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
beforeEach(() => {
  jest.clearAllMocks()
})
describe('main function', () => {

  test('Definitions should create all interface files', async () => {
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

    test('Json data is null', async () => {
      await main({
        url: '',
        output: './src/core/test',
        requestPath: null,
        exportsRequest: true
      })
      expect(writeInterfaces).toHaveBeenCalledTimes(0)
      expect(writeRequest).toHaveBeenCalledTimes(0)
      expect(writeExport).toHaveBeenCalledTimes(0)
    })

    test('Append file error log', async () => {
      try {
        await await main({
          url: 'https://petstore.swagger.io/v2/swagger.json',
          output: './src/core/test',
          requestPath: 'error',
          exportsRequest: true
        })
      } catch(err) {
        expect(err).toBe(2)
      }
    })
    test('No export request', async () => {
      await await main({
        url: 'https://petstore.swagger.io/v2/swagger.json',
        output: './src/core/test',
        exportsRequest: false
      })
      expect(writeRequest).toBeCalledTimes(0)
    })

})

