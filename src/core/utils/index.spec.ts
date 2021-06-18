import * as exportModules from './index'


test('exports modules', () => {
  expect(exportModules).toHaveProperty('fetchApiJson')
  expect(exportModules).toHaveProperty('registerTemplates')
  expect(exportModules).toHaveProperty('writeInterfaces')
  expect(exportModules).toHaveProperty('writeServices')
  expect(exportModules).toHaveProperty('writeRequest')
  expect(exportModules).toHaveProperty('writeIndex')
  expect(exportModules).toHaveProperty('writeExport')
})