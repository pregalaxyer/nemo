import fs from 'fs-extra'
import * as mustache from 'mustache'
import { writeMustacheFile } from './files'
jest.mock('mustache', () => ({
  __esModule: true,
  render: jest.fn().mockReturnValue('')
}))
jest.mock('fs-extra', () => {
  return {
    _isEsModule: true,
    writeFileSync: jest.fn(() => {}),
    pathExistsSync: jest.fn().mockReturnValue(true),
    removeSync: jest.fn(),
    mkdirsSync: jest.fn(),
    readdirSync: jest.fn().mockImplementation(async(path) => {
      const arr = String(path).indexOf('models') ? ['./models/index.ts'] : ["./services/index.ts"]
      return arr
    })
  };
});
describe('files tests', () => {

  test('mustache render have been called', async () => {
    const testTemp = `name: {{name}}, author: {{author}}`
    const testData = {
      name: 'render_test',
      author: 'dylan'
    }

    await writeMustacheFile(testTemp, testData, '../.test')
    expect(mustache.render).toBeCalledWith(testTemp, testData)
    expect(fs.writeFileSync).toBeCalled()
  })
})
