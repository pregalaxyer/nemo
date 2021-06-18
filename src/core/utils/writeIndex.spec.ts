import { writeIndex } from './writeIndex'
import * as files from './files'
import { registerTemplates } from './registerTemplate'
jest.mock('./files', () => ({
  _esModule: true,
  writeMustacheFile: jest.fn()
}))

describe('writeIndex tests',() => {
  let templates
  beforeAll(async () => {
    templates = {
      index: 'index',
      model: 'model',
      request: 'request',
      'request.d': 'request.d',
      service: 'service',
    }
  })
  test('writeIndex should call writeMustacheFile', async () => {
    await writeIndex(['test.ts'], templates, '../.test')
    expect(files.writeMustacheFile).toHaveBeenCalledTimes(1)
    expect(files.writeMustacheFile).toBeCalledWith(templates.index, {
      exports: [{"filename": "test","filepath": "test",}],
      name: 'index'
    }, '../.test')
  })
 

})