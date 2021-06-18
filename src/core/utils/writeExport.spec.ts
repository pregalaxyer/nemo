import { writeExport } from './writeExport'
import * as path from 'path'
import fs from 'fs-extra'
import {writeIndex  } from './writeIndex'
jest.mock('./writeIndex')
jest.mock('fs-extra', () => {
  return {
    _isEsModule: true,
    writeFileSync: jest.fn(() => {}),
    pathExistsSync: jest.fn().mockReturnValue(true),
    removeSync: jest.fn(),
    mkdirsSync: jest.fn(),
    readdirSync: jest.fn().mockImplementation(async(path) => {
      return ['index.ts']
    })
  };
});


describe('writeExports test', () => {
  test('writeExports should call writeIndex', async() => {
    await writeExport({ index: 'aaa'}, path.join(__dirname, '../.test'))
    expect(writeIndex).toHaveBeenCalledTimes(1)
    expect(writeIndex).toHaveBeenCalledWith(
      ["./models/index.ts", "./services/index.ts"],
      { index: 'aaa'},
      path.join(__dirname, '../.test') )
  })
})
