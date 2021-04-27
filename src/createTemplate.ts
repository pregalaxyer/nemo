import * as fs from 'fs'
import * as path from 'path'

export async function getTemplates(): Promise<{
  [key: string]: string
}> {
  const templatePath = path.resolve(__dirname, '../template')
  const temps = await fs.readdirSync(templatePath)
  const templates: Record<string, string>  = {}
  for(let i =0; i < temps.length; i ++) {
    templates[temps[i].split('.mustache')[0]] = await fs.readFileSync(
      path.join(templatePath, '/' + temps[i]),
      'utf-8'
    )
  }
  return templates
}

