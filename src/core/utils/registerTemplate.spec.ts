import { registerTemplates, decodeBase64 } from './registerTemplate'



test('base64 decoder', () => {
  // Base64 Encoding in Node.js
  const base64 = 'QmFzZTY0IEVuY29kaW5nIGluIE5vZGUuanM=';
  expect(decodeBase64(base64)).toBe('Base64 Encoding in Node.js')
})
test('registerTemplates should return templates', () => {
  expect(registerTemplates()).toHaveProperty('index')
  expect(registerTemplates()).toHaveProperty('request')
  expect(registerTemplates()).toHaveProperty('model')
  expect(registerTemplates()).toHaveProperty('utils')
})