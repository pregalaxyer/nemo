import { writeServices } from './writeServices'
import * as files from './files'
import { getTemplates } from './share'
jest.mock('./files')

describe('writeServices tests',() => {
  let templates
  beforeAll(async () => {
    templates = await getTemplates()
  })
  test('writeServices should call writeMustacheFile', async () => {
    await writeServices([{
      name: 'test',
      description: 'test',
      imports: [],
      requests: []
    }], templates, '.', '.')
    expect(files.writeMustacheFile).toHaveBeenCalledTimes(1)
    expect(files.writeMustacheFile).toBeCalledWith(templates.service, {
      name: 'test',
      description: 'test',
      imports: [],
      requests: [],
      requestPath: '.'
    }, './services')
  })
})