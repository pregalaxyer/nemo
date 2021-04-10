import { fetchApiJson, getTemplates,  writeInterfaces, writeServices, folderCheck } from './utils'
import { convertModels } from './interfaces/index'
import { convertService } from './services/index'
import * as path from 'path'
import * as fs from 'fs-extra'

export async function main({
  url,
  src,
  requestPath
}: {
  url: string
  src?: string
  requestPath?: string
}): Promise<void> {
  const [res, templates ] = await Promise.all([
    fetchApiJson(url),
    getTemplates()
  ])
  let folder =  path.join(process.cwd(), src || '/api')
  if (res) {
    const isExists = await fs.pathExistsSync(folder)
    if(isExists) {
      await fs.removeSync(folder)
    }
    await fs.mkdirsSync(folder)
    writeInterfaces(
      convertModels(res.definitions),
      templates,
      folder
    )
    writeServices(
      convertService(res),
      templates,
      folder,
      requestPath || 'request'
    )
  }
}