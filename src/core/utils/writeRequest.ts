import { writeMustacheFile } from './files'
import { Model } from '../interfaces/index.d'
import * as fs from 'fs-extra'

export async function writeRequest(
  templete: Record<string, string>,
  path: string
): Promise<void> {
  try {
    await fs.mkdirsSync(path + '/request')
    await Promise.all([
      writeMustacheFile(templete.request, {
        name: 'index'
      }, path + '/request' ),
      writeMustacheFile(templete['request.d'], {
        name: 'index.d'
      }, path + '/request' )
    ])
  } catch(err) {
    console.error(err)
  }
  
}