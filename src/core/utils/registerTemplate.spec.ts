import { registerTemplates, decodeBase64 } from './registerTemplate'

test('base64 decoder', () => {
  // Base64 Encoding in Node.js
  const base64 = 'QmFzZTY0IEVuY29kaW5nIGluIE5vZGUuanM='
  expect(decodeBase64(base64)).toBe('Base64 Encoding in Node.js')
})
test('registerTemplates should return templates', () => {
  const templates = registerTemplates()
  expect(templates).toHaveProperty('index')
  expect(templates).toHaveProperty('request')
  expect(templates).toHaveProperty('model')
  expect(templates).toHaveProperty('utils')
})
