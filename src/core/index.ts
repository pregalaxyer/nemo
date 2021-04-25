import { fetchApiJson, getTemplates,  writeInterfaces, writeServices, writeIndex, writeRequest} from './utils'
import { convertModels } from './interfaces/index'
import { convertService } from './services/index'
import * as path from 'path'
import * as fs from 'fs-extra'

export async function main({
  url,
  output,
  requestPath
}: {
  /**
   * @description swagger api url
   */
  url: string
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
}): Promise<void> {
  const [res, templates ] = await Promise.all([
    fetchApiJson(url),
    getTemplates()
  ])
  let folder =  path.join(process.cwd(), output || '/api')
  if (res) {
    const isExists = await fs.pathExistsSync(folder)
    if(isExists) {
      await fs.removeSync(folder)
    }
    await fs.mkdirsSync(folder)
    if (!requestPath) {
      writeRequest(templates, folder)
    }
    try {
      await Promise.all(
        [
          writeInterfaces(
            convertModels(res.definitions),
            templates,
            folder
          ),
          writeServices(
            convertService(res),
            templates,
            folder,
            requestPath || '../request'
          )
        ]
      )
    } catch(err) {
      console.error('write models and service error: ', err)
    }
    writeExports(templates, folder)
    
  }
}

export async function writeExports(templates, folder) {
  const [models, services] = await Promise.all([
    fs.readdirSync(folder + '/models'),
    fs.readdirSync(folder + '/services')
  ])
  if (!models.length && !services.length) return
  await writeIndex(
    models.map(
      model => './models/' + model
    ).concat(
      ...services.map(
        service => './services/' + service
      )
    ),
    templates,
    folder
  )
}