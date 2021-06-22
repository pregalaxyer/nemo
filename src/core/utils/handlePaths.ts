import { convertModels } from '../interfaces/index'
import { Swagger } from '../types'
import { convertService } from '../services/index'

export function handlePaths(res: Swagger, paths?: string[]) {
  let models = [], services
  if (paths) {
    Object.keys(res.paths).forEach(path => {
      if (!paths.includes(path)) {
        delete res.paths[path]
      }
    })
    // need exclude no request controller
    services = convertService(res).filter(service => service.requests.length)
    let { imports } = services.reduce((pre, cur) => (pre.imports || []).concat(cur.imports))
    let allModels = convertModels(res.definitions)
    // recursive search for the api models and imports the model linked
    function deepModels(imports) {
      models.push(
        ...allModels.filter(
          model=> imports.includes(model.name)
        )
      )
      let names =  models.map(model => model.name) 
      models.forEach(model => {
        if (model.imports) {
          let excludeDeps =  model.imports.filter(linkImport => !names.includes(linkImport))
          if (excludeDeps.length) {
            deepModels(excludeDeps)
          }
        }
      })
    }
    deepModels(imports)
  } else {
    services = convertService(res)
    models = convertModels(res.definitions)
  }
  return {
    models,
    services
  }
}