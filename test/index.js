const { main } = require('../lib/index.js')
const path = require('path')
main({
  url: 'https://petstore.swagger.io/v2/swagger.json',
  output: '../.test_folder'
})
// console.log(path.join('.', '/src/templates'))