
import fetch from 'node-fetch'
import { Swagger } from '../types'
/**
 * @description fetch the api json from remote
 * @param { url} swagger api url
 * @returns 
 */
export async function fetchApiJson(url: string): Promise<Swagger> {
  try {
    const res = await fetch(url, {}).then(res => res.json())
    return res
  } catch(err) {
    throw Error(`fetch swagger api json data error: ${err}`)
  }
}


