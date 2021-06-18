import { fetchApiJson } from './share'
import fetch from 'node-fetch'
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

