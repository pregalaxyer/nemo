
import { writeMustacheFile } from './files'
import { Model } from '../interfaces/index.d'
import * as fs from 'fs-extra'

export async function writeInterfaces(
  models: Model[],
  templete: Record<string, string>,
  path: string
): Promise<void> {
  await fs.mkdirsSync(path + '/models')
  const res = await Promise.all(
    models.map(model => writeMustacheFile(templete.model, model, path + '/models'))
  )
}