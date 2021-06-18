import { writeMustacheFile } from './files'
import { Model } from '../interfaces/index.d'
import * as fs from 'fs-extra'
import { Templates }  from './registerTemplate'

export async function writeRequest(
  templates: Templates,
  path: string
): Promise<void> {
  try {
    await fs.mkdirsSync(path + '/request')
    await Promise.all([
      writeMustacheFile(templates.request, {
        name: 'index'
      }, path + '/request' ),
      writeMustacheFile(templates['request.d'], {
        name: 'index.d'
      }, path + '/request' )
    ])
  } catch(err) {
    console.error(err)
  }
}