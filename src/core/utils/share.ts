import * as fs from 'fs'
import * as path from 'path'
import * as fetch from 'node-fetch'
import { Swagger } from '../types'
/**
 * @description get template mustache
 * @returns 
 */
export async function getTemplates(): Promise<{
  [key: string]: string
}> {
  const templatePath = path.resolve(__dirname, '../../template')
  const temps = await fs.readdirSync(templatePath)
  const templates: Partial<Record< 'index' | 'model' | 'service' | 'request' | 'request.d', string>>= {}
  for(let i =0; i < temps.length; i ++) {
    templates[temps[i].split('.mustache')[0]] = await fs.readFileSync(
      path.join(templatePath, '/' + temps[i]),
      'utf-8'
    )
  }
  return templates
}
/**
 * @description fetch the api json from remote
 * @param { url} swagger api url
 * @returns 
 */
export async function fetchApiJson(url: string): Promise<Swagger> {
  try {
    const res = await fetch(url).then(res => res.json())
    return res
  } catch(err) {
    throw Error(`fetch swagger api json data error: ${err}`)
  }
}


