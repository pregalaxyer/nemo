import { fetchApiJson, getTemplates,  writeInterfaces, writeServices } from './utils'
import { convertModels } from './interfaces/index'
import { convertService } from './services/index'
import * as path from 'path'

export async function main({
  url,
  src
}: {
  url: string
  src?: string
}): Promise<void> {
  const [res, templates ] = await Promise.all([
    fetchApiJson(url),
    getTemplates()
  ])
  let folder = src || process.cwd()
  if (res) {
    writeInterfaces(
      convertModels(res.definitions),
      templates,
      folder
    )
    writeServices(
      convertService(res),
      templates,
      folder
    )

  }
}