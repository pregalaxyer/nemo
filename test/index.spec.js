const { main } = require('../lib')

describe('main function', () => {
  afterAll(async() => {
    await main({
      url: 'https://petstore.swagger.io/v2/swagger.json',
      output: '/.test_folder'
    })
  })
  test('TODO test', () => {

  })

})