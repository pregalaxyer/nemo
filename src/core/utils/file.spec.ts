import fs from 'fs-extra'
import * as path from 'path'
import * as mustache from 'mustache'
import { writeMustacheFile } from './files'
jest.mock('mustache', () => ({
  __esModule: true,
  render: jest.fn().mockReturnValue('')
}))

describe('files tests', () => {
  
  test('mustache render have been called', async () => {
    const testTemp = `name: {{name}}, author: {{author}}`
    const testData = {
      name: 'render_test',
      author: 'dylan'
    }
    await writeMustacheFile(testTemp, testData, '../.test')
    expect(mustache.render).toBeCalledWith(testTemp, testData)
  })
})