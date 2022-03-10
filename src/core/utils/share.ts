import fetch from 'node-fetch'
import { Swagger } from '../types'
import * as fs from 'fs-extra'
import ora from 'ora'
import chalk from 'chalk'
const isHttpReg = /^https?/
/**
 * @description fetch the api json from remote
 * @param { url} swagger api url
 * @returns
 */
export async function fetchApiJson(url: string): Promise<Swagger> {
  let spinner
  try {
    if (!isHttpReg.test(url)) {
      const res = await fs.readJson(url)
      return res
    }
    spinner = ora(
      `Fetch swagger api json from ${chalk.blue.underline(url)}`,
    ).start()
    const res = await fetch(url, {}).then((res) => res.json())
    spinner.succeed()
    return res
  } catch (err) {
    spinner && spinner.fail(err.toString())
  }
}

/**
 * @description https://datatracker.ietf.org/doc/html/rfc3986
 */
export function fixedEncodeURI(str: string): string {
  return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']')
}
