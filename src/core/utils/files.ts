import * as fs from 'fs-extra'
import * as path from 'path'
import * as mustache from 'mustache'
import chalk from 'chalk'
const log = console.log
export async function writeMustacheFile(temp: string, view: {
  name: string
  [key: string]: any
}, src: string) {
  try {
    const modelData = mustache.render(temp, view)
    const file = path.join(src, `./${view.name}.ts`)
    await fs.writeFileSync(
      file,
      modelData
    )
    log(`🐠 nemo log: ` + chalk.yellow.underline(file) + ' created ✨')
  } catch(err) {
    throw Error(`write file error: ${err}`)
  }
}
