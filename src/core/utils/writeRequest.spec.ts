import { writeRequest } from './writeRequest'
import * as fs from 'fs-extra'
import {writeMustacheFile } from './files'
jest.mock('fs-extra', () => ({
  __esModule: true,
  mkdirsSync: jest.fn().mockImplementation(async (path: string) => {
    if (path.startsWith('undefined')) throw Error()
    return true
  })
}))
jest.mock('./files', () => ({
  __esModule: true,
  writeMustacheFile: jest.fn().mockReturnValue(Promise.resolve(true))
}))
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
  test('fs and writeMustacheFile module called', async () => {
    await writeRequest(templates, '../.test')
    expect(fs.mkdirsSync).toBeCalled()
    // @ts-ignore
    await writeRequest({}, 'undefined')
    expect(writeMustacheFile).toHaveBeenCalledTimes(1)

  })
})
