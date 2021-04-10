
import { writeMustacheFile } from './files'
import { Model } from '../interfaces/type'
import * as fs from 'fs-extra'

export async function writeInterfaces(
  models: Model[],
  templete: Record<string, string>,
  path: string
): Promise<void> {
  await fs.removeSync(path)
  await fs.mkdirsSync(path)
  await fs.mkdirsSync(path + '/models')
  const res = await Promise.all(
    models.map(model => writeMustacheFile(templete.model, model, path + '/models'))
  )
}