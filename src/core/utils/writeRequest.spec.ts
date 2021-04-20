import { writeRequest } from './writeRequest'
import * as files from './files'
import { getTemplates } from './share'
describe('write request tests', () => {
  let templates
  beforeAll(async () => {
    templates = await getTemplates()
  })
  test('fs module called', async () => {
    const writeMustacheFile = jest.spyOn(files, 'writeMustacheFile')
    await writeRequest(templates, './.test_folder')
    expect(writeMustacheFile).toHaveBeenCalledTimes(2)
    expect(writeMustacheFile).toHaveBeenCalledWith(templates.request, {
      name: 'index'
    }, './.test_folder' + '/request')
  })
})