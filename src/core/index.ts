import { fetchApiJson, registerTemplates,  writeInterfaces, writeServices, writeRequest, writeExport } from './utils'
import { convertModels } from './interfaces/index'
import { Swagger } from './types'
import { convertService } from './services/index'
import * as path from 'path'
import * as fs from 'fs-extra'

interface SwaggerConfig {
  /**
   * @description swagger api url
   */
  url: string
  /**
   * @description single-api or apis
   */
  paths?: string[]
  /**
   * @description output floder
   */
  output?: string
  /**
   * @description where request module import from
   */
  requestPath?: string
  /**
   * @description request templates only create and remove when it is true
   * when you only need exportsRequest once, mostly code likes:
   * * `exportsRequest: !isRequestFloderExsit`
   */
  exportsRequest?: boolean
}
export default async function main({
  url,
  output,
  paths=undefined,
  requestPath,
  exportsRequest
}: SwaggerConfig): Promise<void> {
  const templates = registerTemplates()
  const res = await fetchApiJson(url)
  const needExports = exportsRequest === undefined ? true : exportsRequest
  let folder =  path.join(process.cwd(), output || '/api')
  if (res) {
    const isExists = await fs.pathExistsSync(folder)
    if(isExists) {
      await fs.removeSync(folder)
    }
    await fs.mkdirsSync(folder)
    if (!requestPath && needExports) {
      writeRequest(templates, folder)
    }
    const { models, services} = getModelAndServices(res, paths)
    try {
      await Promise.all(
        [
          writeInterfaces(
            models,
            templates,
            folder
          ),
          writeServices(
            services,
            templates,
            folder,
            requestPath || '../request'
          )
        ]
      )
    } catch(err) {
      console.error('write models and service error: ', err)
    }
    writeExport(templates, folder)
    
  }
}

export function getModelAndServices(res: Swagger, paths?: string[]) {
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

