import { writeMustacheFile } from './files'
import { ServiceController } from '../services/index.d'
import * as fs from 'fs-extra'
export async function writeServices(
  services: ServiceController[],
  templete: Record<string, string>,
  path: string,
  requestPath: string
): Promise<void> {
  try {
    await fs.mkdirsSync(path + '/services')
    console.log('services', services, templete.service)
    const res = await Promise.all(
      services.map(service => 
        writeMustacheFile(templete.service, {
          ...service,
          requestPath
        }, path + '/services')
      )
    )
  } catch(err) {
    console.error(err)
  }
  
}