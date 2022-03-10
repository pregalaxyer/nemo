import { writeExport, writeIndex } from './writeExport'
import * as path from 'path'
// import {writeIndex  } from './writeIndex'
// import { writeIndex } from './writeIndex'
import * as files from './files'
jest.mock('fs-extra', () => {
  return {
    _isEsModule: true,
    writeFileSync: jest.fn(() => {}),
    pathExistsSync: jest.fn().mockReturnValue(true),
    removeSync: jest.fn(),
    mkdirsSync: jest.fn(),
    readdirSync: jest.fn().mockImplementation(async (path) => {
      return ['index.ts']
    }),
  }
})
jest.mock('./files', () => ({
  _esModule: true,
  writeMustacheFile: jest.fn(),
}))

describe('writeIndex tests', () => {
  let templates
  beforeAll(async () => {
    jest.restoreAllMocks()
    templates = {
      index: 'index',
      model: 'model',
      request: 'request',
      'request.d': 'request.d',
      service: 'service',
    }
  })
  test('writeIndex should call writeMustacheFile', async () => {
    await writeIndex(['test.ts'], templates, '../.test')
    expect(files.writeMustacheFile).toBeCalled()
  })

  test('writeExports should call writeIndex', async () => {
    await writeExport({ index: 'aaa' }, path.join(__dirname, '../.test'))
    expect(files.writeMustacheFile).toBeCalled()
  })
})
