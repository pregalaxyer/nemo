import { getControllers, convertService, getParameters, getResponseType } from './index'
import { fetchApiJson } from '../utils/share'
import * as ServiceModule from './index'

describe('services tests',  () => {
  let swagger
  beforeAll(async() => {
    swagger = await fetchApiJson('https://petstore.swagger.io/v2/swagger.json')
  })
  
  test('getControllers from tags have property of user', async() => {
    expect(
      getControllers(swagger.tags)
    ).toHaveProperty('user', {
      name: 'user',
      description: 'Operations about user',
      imports: [],
      requests: []
    })
  })


  test('convertServices has store service ',  () => {
    
    expect(
      convertService(swagger)
    ).toContainEqual({
      name: 'store',
      description: 'Access to Petstore orders',
      imports: ['Order'],
      requests: expect.any(Array)
    })
    
  })



})

