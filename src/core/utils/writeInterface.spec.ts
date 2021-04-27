import { writeInterfaces } from './writeInterface'
import * as files from './files'
import { getTemplates } from './share'
jest.mock('./files')

describe('writeInterfaces tests',() => {
  let templates
  beforeAll(async () => {
    templates = await getTemplates()
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
  })
})