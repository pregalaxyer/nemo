
import { writeMustacheFile } from './files'
import { Model } from '../interfaces/index.d'
const fs = require('fs-extra')

export async function writeInterfaces(
  models: Model[],
  templates: Record<string, string>,
  path: string
): Promise<void> {
  try {
    await fs.mkdirsSync(path + '/models')
    const res = await Promise.all(
      models.map(model => writeMustacheFile(templates.model, model, path + '/models'))
    )
  } catch(err) {
    console.error(err)
  }
  
}