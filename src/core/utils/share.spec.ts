import { fetchApiJson, fixedEncodeURI } from './share'
import fetch from 'node-fetch'
import * as fs from 'fs-extra'
import ora from 'ora'
jest.mock('ora', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    start: jest.fn().mockReturnValue({
      succeed: jest.fn(),
      fail: jest.fn()
    })
  })
}))

jest.mock('fs-extra', () => ({
  __esModule: true,
  readJson: jest.fn().mockResolvedValue({
      swagger: '',
      info: {},
      tags: [],
      paths: [],
      definitions: {}
    })
}))

jest.mock('node-fetch', () => {
  let count = 1
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(async () => {
      if (count === 0) throw Error('fetch error')
      count --
      return {
        json: () =>({
          swagger: '',
          info: {},
          tags: [],
          paths: [],
          definitions: {}
        })
      }
  })
  }
})

describe('fetch swagger api json', () => {
  test('fetchApiJson should return a json with swagger schema',  async () => {
    const res = await fetchApiJson('https://petstore.swagger.io/v2/swagger.json')
    expect(res).toMatchObject({
      swagger: expect.any(String),
      info: expect.any(Object),
      tags: expect.any(Array),
      paths: expect.any(Object),
      definitions: expect.any(Object)
    })
    expect(ora).toBeCalled()
    expect(ora().start).toBeCalled()
    await fetchApiJson('https?localhost')
    expect(ora().start().fail).toBeCalled()
  })

  test('url is a json type file', async () => {
    const json = await fetchApiJson('./package.json')
    expect(json.swagger).toBeDefined()
  })
  test('fixedEncodeURI test with normal url or chinese word url', () => {
    expect(fixedEncodeURI('https://www.facebook.com')).toBe('https://www.facebook.com')
    expect(fixedEncodeURI('https://www.facebook.com?city=上海')).toBe('https://www.facebook.com?city=%E4%B8%8A%E6%B5%B7'
    )
  })
})

