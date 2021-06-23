import { writeRequest } from './writeRequest'
import * as files from './files'
describe('write request tests', () => {
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
  test('fs module called', async () => {
    const writeMustacheFile = jest.spyOn(files, 'writeMustacheFile')
    await writeRequest(templates, '../.test')
    expect(writeMustacheFile).toHaveBeenCalledTimes(1)
    expect(writeMustacheFile).toHaveBeenCalledWith(templates.request, {
      name: 'index'
    }, '../.test' + '/request')
  })
})