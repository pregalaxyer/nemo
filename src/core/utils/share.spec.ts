import { getTemplates, fetchApiJson } from './share'

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
  test('getTemplates should log all the temps', async () => {
      const templates = await getTemplates()
      expect( templates ) .toHaveProperty('model', expect.any(String))
      expect( templates ) .toHaveProperty('service', expect.any(String))
      expect( templates ) .toHaveProperty('index', expect.any(String))
  })
})