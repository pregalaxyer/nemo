import { writeIndex } from './writeIndex'
import * as files from './files'
import { getTemplates } from './share'
jest.mock('./files')

describe('writeIndex tests',() => {
  let templates
  beforeAll(async () => {
    templates = await getTemplates()
  })
  test('writeIndex should call writeMustacheFile', async () => {
    await writeIndex(['test'], templates, '')
    expect(files.writeMustacheFile).toHaveBeenCalledTimes(1)
    expect(files.writeMustacheFile).toBeCalledWith(templates.index, {
      exports: ['test'],
      name: 'index'
    }, '')
  })
  test('writeIndex should call writeMustacheFile', async () => {
    writeIndex(null, templates.index, '')
    .then().catch(err => expect(err).toThrowError())
    
  })

})