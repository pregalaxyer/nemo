import * as fs from 'fs-extra'
import { writeMustacheFile } from './files'
import { Templates } from './registerTemplate'
export async function writeIndex(
  files: string[],
  templates: Templates,
  path: string,
): Promise<void> {
  await writeMustacheFile(templates.index, {
    exports: files.map(file => ({
      filepath: file.replace(/\.ts$/, ''),
      filename: file.split('/').pop().replace(/\.ts$/, '')
    })),
    name: 'index'
  }, path)


}

export async function writeExport(templates, folder) {
  const [models, services] = await Promise.all([
    fs.readdirSync(folder + '/models'),
    fs.readdirSync(folder + '/services')
  ])
  if (!models.length && !services.length) return
  await writeIndex(
    models.map(
      model => './models/' + model
    ).concat(
      ...services.map(
        service => './services/' + service
      )
    ),
    templates,
    folder
  )
}
