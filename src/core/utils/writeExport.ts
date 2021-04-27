import * as fs from 'fs-extra'
import { writeIndex } from './writeIndex'

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