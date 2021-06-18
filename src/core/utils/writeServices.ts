import { writeMustacheFile } from './files'
import { ServiceController } from '../services/index.d'
import * as fs from 'fs-extra'
import { Templates } from './registerTemplate'
export async function writeServices(
  services: ServiceController[],
  templates: Templates,
  path: string,
  requestPath: string
): Promise<void> {
  try {
    await fs.mkdirsSync(path + '/services')
    const res = await Promise.all(
      services.map(service => 
        writeMustacheFile(templates.service, {
          ...service,
          requestPath
        }, path + '/services')
      )
    )
  } catch(err) {
    console.error(err)
  }
  
}