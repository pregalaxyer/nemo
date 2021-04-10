import { getTemplates } from './share'
import {fetchApiJson} from './share'

describe('fetch swagger api json', () => {
  test('fetchApiJson should return a json with swagger schema',  () => {
      expect(
        fetchApiJson('https://petstore.swagger.io/v2/swagger.json')
      ).resolves.toMatchObject({
        swagger: expect.any(String),
        info: expect.any(Object),
        tags: expect.any(Array),
        paths: expect.any(Object),
        definitions: expect.any(Object),
      })
    })
})

describe('share utils tests', () => {
  test('getTemplates should log all the temps', () => {
      expect(getTemplates()).resolves.toMatchObject({
        model: expect.any(String)
      })
    })
})