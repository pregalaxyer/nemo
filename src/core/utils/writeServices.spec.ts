import { writeServices } from './writeServices'
import * as files from './files'
jest.mock('./files')

describe('writeServices tests', () => {
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
  test('writeServices should call writeMustacheFile', async () => {
    await writeServices(
      [
        {
          name: 'test',
          description: 'test',
          imports: [],
          requests: [],
        },
      ],
      templates,
      '../.test',
      '.',
    )
    expect(files.writeMustacheFile).toHaveBeenCalledTimes(1)
    expect(files.writeMustacheFile).toBeCalledWith(
      templates.service,
      {
        name: 'test',
        description: 'test',
        imports: [],
        requests: [],
        requestPath: '.',
      },
      '../.test/services',
      {
        parameters: templates.parameters,
        alias: templates.alias,
      },
    )
    let error = jest.spyOn(global.console, 'error')
    // @ts-ignore
    await writeServices({}, null, '')
    expect(error).toBeCalled()
  })
})
