import * as fs from 'fs-extra'
import * as path from 'path'
import * as mustache from 'mustache'

export async function writeMustacheFile(temp, view, src) {
  try {
    console.log(temp, view)
    const modelData = mustache.render(temp, view)
    await fs.writeFileSync(
      path.join(src, `./${view.name}.ts`),
      modelData
    )
  } catch(err) {
    throw Error(`write model file error: ${err}`)
  }
}

export async function folderCheck(path) {
  
}
