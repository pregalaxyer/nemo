import { handlePaths } from './handlePaths'
import { fetchApiJson } from './share'

let res
beforeAll(async() => {
  res = await fetchApiJson('https://petstore.swagger.io/v2/swagger.json')
})

test('single api should return link models and paths', async () => {
  const {models, services} = handlePaths(res,['/pet'])
  expect(services).toHaveLength(1)
  expect(models).toHaveLength(3)
})