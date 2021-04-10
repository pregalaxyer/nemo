import { writeMustacheFile } from './files'
import { ServiceController } from '../services/type'
import * as fs from 'fs-extra'
export async function writeServices(
  services: ServiceController[],
  templete: Record<string, string>,
  path: string
): Promise<void> {
  const isEmptyPath = await fs.emptyDirSync(path)
  if(isEmptyPath) {
    await fs.mkdirSync(path)
  }
  await fs.mkdirsSync(path + '/services')
  const res = await Promise.all(
    services.map(service => writeMustacheFile(templete.service, service, path + '/services'))
  )
}