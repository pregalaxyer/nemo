import { Definition } from '../types'
import request, { isBlob, isString, getUrl, getHeaders, getFormData, getRequestBody} from './index'
import * as RequestModule from './index'
import { setupServer } from 'msw/node'
import {  rest } from 'msw'

const server = setupServer(
  rest.get('/swagger.json', (req, res, ctx) => {
    return res(ctx.json({}))
  })
)
//  Enable API mocking before tests.
beforeAll(() => {
  global.fetch= require('node-fetch')
  server.listen()

})

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())
describe('request module test', () => {
  it("getUrl always stringfy from options's query", () => {
    expect(getUrl('https://test.cn', undefined)).toBe('https://test.cn')
    expect(getUrl( 'https://test.cn', {name: 'tim'} ) ).toMatch('name=tim')
  })

  it('isBlob only return true when value is a blob', () => {
    expect(isBlob(undefined)).toBe(false)
    expect(isBlob(new Blob())).toBe(true)
  })

  it('isString only return true when value is a string', () => {
    expect(isString(undefined)).toBe(false)
    expect(isString('string')).toBe(true)
  })
  it('getHeaders should return a default value', () => {
    expect(
      getHeaders({
        url: 'https://test.cn',
        method: 'GET',
        body: undefined
      })
    ).toStrictEqual(
      new Headers({
        Accept: 'application/json',
      })
    )
    expect(
      getHeaders({
        url: 'https://test.cn',
        method: 'GET',
        body: {}
      })
    ).toStrictEqual(
      new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json'
      })
    )
  })

  it('getFormData always return a formData', () => {
    const formData = new FormData()
    formData.append('name', 'file')
    expect(
      getFormData({name: 'file'})
    ).toStrictEqual(formData)
  })


})

describe('getRequestBody return tests', () => {
  test('no body or formData will return undefined', () => {
    expect(
      getRequestBody(
        {
          url: 'https://test.cn',
          method: 'GET',
          query: { id: 1}
        }
      )
    ).toBe(undefined)
  })
  test('a json body  will return string', () => {
    expect(
      getRequestBody(
        {
          url: 'https://test.cn',
          method: 'GET',
          body: { id: 1}
        }
      )
    ).toBe(JSON.stringify({ id: 1}))
  })
})

describe('request method tests', () => {

  test('request will call getUrl, getHeaders, getRequestBody one by one', async() => {
    console.log(RequestModule)
    const getUrl = jest.spyOn(RequestModule, 'getUrl')
    const fetch = jest.spyOn(global, 'fetch')
    const getHeaders = jest.spyOn(RequestModule, 'getHeaders')
    const getRequestBody = jest.spyOn(RequestModule, 'getRequestBody')
    await request<any>({
      url: 'https://petstore.swagger.io/v2/store/order',
      method: 'POST',
      body: {
        "id": 0,
        "petId": 0,
        "quantity": 0,
        "shipDate": "2021-04-23T06:23:18.978Z",
        "status": "placed",
        "complete": true
      }
    })
    expect(fetch).toBeCalledTimes(1)
    expect(getUrl).toBeCalledTimes(1)
    expect(getHeaders).toBeCalledTimes(1)
    expect(getRequestBody).toBeCalledTimes(1)
  }, 2000)
})