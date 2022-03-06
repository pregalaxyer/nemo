import {
  getControllers,
  convertService,
  getParameters,
  getResponseType,
  getServiceMapData,
  handlerBasePath,
  createAlias,
} from './index'
import { fetchApiJson } from '../utils/share'
import { Parameter } from '../types'

describe('services tests', () => {
  let swagger
  beforeAll(async () => {
    swagger = await fetchApiJson('https://petstore.swagger.io/v2/swagger.json')
  })

  test('getControllers from tags have property of user', async () => {
    expect(getControllers(swagger.tags)).toHaveProperty('user', {
      name: 'UserService',
      description: 'Operations about user',
      imports: [],
      requests: [],
    })
  })

  test('convertServices has store service ', () => {
    expect(convertService(swagger)).toContainEqual({
      name: 'StoreService',
      description: 'Access to Petstore orders',
      imports: ['Order'],
      requests: expect.any(Array),
    })
  })

  test('create alias replace illegal word with "-"', () => {
    expect(createAlias('user-name')).toBe('user_name')
  })

  // TODO: getparameters getResponseType getServiceName

  test('getparameters', () => {
    const parameters: Parameter[] = [
      {
        in: 'body',
        name: 'request',
        description: 'request',
        required: true,
        schema: {
          $ref: '#/definitions/AchievementTransferAddRequest',
        },
      },
      {
        name: 'user-name',
        in: 'header',
        description: 'user-name',
        required: true,
        type: 'string',
      },
    ]

    const { parametersRecord: params, parameters: parametersList } =
      getParameters(parameters)
    expect(parametersList[1]).toHaveProperty('alias', 'user_name')
    expect(params.body).toHaveLength(1)
    expect(params.header).toHaveLength(1)
  })

  test('getResponseType should log response type', () => {
    expect(getResponseType({})).toBe('any')
  })

  test('getServiceMapData should add tag in tags', () => {
    let controllerMap = getControllers(swagger.tags)
    getServiceMapData('/pet', swagger, controllerMap)
    expect(controllerMap.pet.requests.length).toBeGreaterThan(1)
  })

  test('handlerBasePath will deal null, undefined', () => {
    expect(handlerBasePath(null)).toBe('')
    expect(handlerBasePath('/v2')).toBe('/v2')
  })
})
