import { writeInterfaces } from './writeInterface'
import * as files from './files'
jest.mock('./files')

describe('writeInterfaces tests',() => {
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
  test('writeInterfaces should call writeMustacheFile', async () => {
    await writeInterfaces([{
      name: 'test',
      description: 'test',
      imports: [],
      types: []
    }], templates, '../.test')
    expect(files.writeMustacheFile).toHaveBeenCalledTimes(1)
    expect(files.writeMustacheFile).toBeCalledWith(templates.model, {
      name: 'test',
      description: 'test',
      imports: [],
      types: []
    }, '../.test/models')
    let error = jest.spyOn(global.console, 'error')
    // @ts-ignore
    await writeInterfaces({}, null, '../.test')
    expect(error).toBeCalled()
  })
})
