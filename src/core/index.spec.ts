import { main } from './index'
import { fetchApiJson, getTemplates} from './utils'
jest.mock('./utils/index')
describe('main function', () => {
  beforeAll(async() => {
    await main({
      url: 'https://petstore.swagger.io/v2/swagger.json',
      output: '/api'
    })
  })
  test('definitions should create all interface files', async () => {
      
      expect(fetchApiJson).toHaveBeenCalledTimes(1)
      expect(getTemplates).toHaveBeenCalledTimes(1)
    })
})