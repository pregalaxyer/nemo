import * as fs from 'fs-extra'
import * as mustache from 'mustache'
import { writeMustacheFile } from './files'
jest.mock('mustache', () => ({
  __esModule: true,
  render: jest.fn().mockReturnValue(''),
}))

jest.mock('fs-extra', () => {
  return {
    _isEsModule: true,
    writeFileSync: jest.fn(() => {}),
  }
})
describe('files tests', () => {
  test('mustache render have been called', async () => {
    const testTemp = `name: {{name}}, author: {{author}}`
    const testData = {
      name: 'render_test',
      author: 'dylan',
    }
    await writeMustacheFile(testTemp, testData, '../.test', {})
    expect(mustache.render).toBeCalledWith(testTemp, testData, {})
    expect(fs.writeFileSync).toBeCalled()
    // @ts-ignore
    writeMustacheFile(testTemp, null, '../.test').catch((err) =>
      expect(err).toBeDefined(),
    )
  })
})
