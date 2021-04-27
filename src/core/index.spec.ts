import { main, writeExports } from './index'
import * as path from 'path'
import { fetchApiJson, getTemplates, writeRequest, writeIndex, writeServices, writeInterfaces} from './utils'
jest.mock('./utils', () => ({
  _esModule: true,
  fetchApiJson: jest.fn(async (e) => {
    return {
      swagger: '2.0.0',
      tags: [{
        name: 'test',
        description: 'test'
      }],
      paths: {

      },
      definitions: {}
    }
  }),
  getTemplates: jest.fn(async() => {
    return {
      index: 'sdsd',
      serverice: 'ssds',
      request: 'ss',
      'request.d': 'ss',
      model: 'ss'
    }
  }),
  writeServices: jest.fn(async(a, b,c,d) => {

  }),
  writeInterfaces: jest.fn(async(a, b,c) => {

  }),
  writeRequest: jest.fn(async(a, b,c) => {

  }),
  writeIndex: jest.fn(async(a, b,c) => {

  }),

}))
describe('main function', () => {
  beforeAll(async() => {
    await main({
      url: 'https://petstore.swagger.io/v2/swagger.json',
      output: path.join(__dirname, 'test')
    })

  })
  test('definitions should create all interface files', async () => {
      expect(fetchApiJson).toHaveBeenCalledTimes(1)
      expect(fetchApiJson).toHaveBeenCalledWith('https://petstore.swagger.io/v2/swagger.json')
      expect(getTemplates).toHaveBeenCalledTimes(1)
      expect(writeServices).toHaveBeenCalledTimes(1)
      expect(writeInterfaces).toHaveBeenCalledTimes(1)
      expect(writeRequest).toHaveBeenCalledTimes(1)
    })
})

describe('writeExports test', () => {
  test('writeExports should call writeIndex', async() => {
    await writeExports({ index: 'aaa'}, path.join(__dirname, 'test'))
    expect(writeIndex).toHaveBeenCalledTimes(1)
    expect(writeIndex).toHaveBeenCalledWith(
      ["./models/index.ts", "./services/index.ts"],
      { index: 'aaa'},
      path.join(__dirname, 'test') )
  })
})