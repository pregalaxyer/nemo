import { getTemplates } from './createTemplate'

describe('share utils tests', () => {
  test('getTemplates should log all the temps', async () => {
      const templates = await getTemplates()
      expect( templates ) .toHaveProperty('model', expect.any(String))
      expect( templates ) .toHaveProperty('service', expect.any(String))
      expect( templates ) .toHaveProperty('index', expect.any(String))
  })
})