import { fetchApiJson, getTemplates,  writeInterfaces, writeServices, writeIndex} from './utils'
import { convertModels } from './interfaces/index'
import { convertService } from './services/index'
import * as path from 'path'
import * as fs from 'fs-extra'

export async function main({
  url,
  output,
  requestPath
}: {
  url: string
  output?: string
  requestPath?: string
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
          requestPath || 'request'
        )
      ]
    )
    const [models, services] = await Promise.all([
      fs.readdirSync(folder + '/models'),
      fs.readdirSync(folder + '/services')
    ])
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
}