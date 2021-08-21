import { getControllers, convertService, getParameters, getResponseType, getServiceMapData } from './index'
import { fetchApiJson } from '../utils/share'
import { Parameter } from '../types'

describe('services tests',  () => {
  let swagger
  beforeAll(async() => {
    swagger = await fetchApiJson('https://petstore.swagger.io/v2/swagger.json')
  })

  test('getControllers from tags have property of user', async() => {
    expect(
      getControllers(swagger.tags)
    ).toHaveProperty('user', {
      name: 'UserService',
      description: 'Operations about user',
      imports: [],
      requests: []
    })
  })


  test('convertServices has store service ',  () => {

    expect(
      convertService(swagger)
    ).toContainEqual({
      name: 'StoreService',
      description: 'Access to Petstore orders',
      imports: ['Order'],
      requests: expect.any(Array)
    })

  })

  // TODO: getparameters getResponseType getServiceName

  test('getparameters', () => {
    const parameters: Parameter[] = [
      {
      "in": "body",
      "name": "request",
      "description": "request",
      "required": true,
      "schema": {
        "$ref": "#/definitions/AchievementTransferAddRequest"
        }
      }
      ]
    expect(
      getParameters(parameters)
    ).toHaveProperty('parametersRecord', {
      'body':
        [{"description": "request", "imports": ["AchievementTransferAddRequest"], "isOption": false, "name": "request", "type": "AchievementTransferAddRequest"}]

    })
  })

  test('getResponseType should log response type', () => {
    expect(getResponseType({})).toBe('any')
  })

  test('getServiceMapData should add tag in tags', () => {
    let controllerMap = getControllers(swagger.tags)
    getServiceMapData('/pet', swagger, controllerMap)
    expect(controllerMap.pet.requests.length).toBeGreaterThan(1)
  })

})

