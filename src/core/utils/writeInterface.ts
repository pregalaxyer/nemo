
import { writeMustacheFile } from './files'
import { Model } from '../interfaces/index.d'
import { Templates } from './registerTemplate'
const fs = require('fs-extra')

export async function writeInterfaces(
  models: Model[],
  templates: Templates,
  path: string
): Promise<void> {
  try {
    await fs.mkdirsSync(path + '/models')
    await Promise.all(
      models.map(model => writeMustacheFile(templates.model, model, path + '/models'))
    )
  } catch(err) {
    console.error(err)
  }

}
