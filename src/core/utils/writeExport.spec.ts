import { writeExport } from './writeExport'
import * as path from 'path'
import * as fs from 'fs-extra'
import {writeIndex  } from './writeIndex'
jest.mock('./writeIndex')

describe('writeExports test', () => {
  test('writeExports should call writeIndex', async() => {
    const readdirSync = jest.spyOn(fs, 'readdirSync').mockImplementation(async (path:unknown) => {
      return String(path).indexOf('models') ? ['./models/index.ts'] : ["./services/index.ts"]
    })
    await writeExport({ index: 'aaa'}, path.join(__dirname, '../.test'))
    expect(writeIndex).toHaveBeenCalledTimes(1)
    expect(writeIndex).toHaveBeenCalledWith(
      ["./models/index.ts", "./services/index.ts"],
      { index: 'aaa'},
      path.join(__dirname, '../.test') )
  })
})