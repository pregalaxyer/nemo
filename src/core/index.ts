import { fetchApiJson, registerTemplates,  writeInterfaces, writeServices, writeRequest, writeExport, handlePaths, fixedEncodeURI } from './utils'
import { writeMustacheFile  } from './utils/files'
import * as path from 'path'
import * as fs from 'fs-extra'
import { SwaggerConfig } from './index.d'

export default async function main({
  url,
  output,
  paths=undefined,
  requestPath,
  exportsRequest
}: SwaggerConfig): Promise<void> {
  const templates = registerTemplates()
  const res = await fetchApiJson(fixedEncodeURI(url))
  const needExports = exportsRequest === undefined ? true : exportsRequest
  let folder =  path.join(process.cwd(), output || '/api')
  if (res) {
    const isExists = await fs.pathExistsSync(folder)
    if(isExists) {
      await fs.removeSync(folder)
    }
    await fs.mkdirsSync(folder)
    if (!requestPath && needExports) {
      await writeRequest(templates, folder)
    }
    const { models, services} = handlePaths(res, paths)
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
          ),
          writeMustacheFile(templates.utils, {name: 'utils'}, folder)
        ]
      )
    } catch(err) {
      console.error('write models and service error: ', err)
    }
    writeExport(templates, folder)

  }
}


