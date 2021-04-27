import * as fs from 'fs'
import * as path from 'path'
import * as fetch from 'node-fetch'
import { Swagger } from '../types'
export * from '../../createTemplate'
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


