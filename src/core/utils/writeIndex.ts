import { writeMustacheFile } from './files'
import { Templates } from './registerTemplate'
export async function writeIndex(
  files: string[],
  templates: Templates,
  path: string,
): Promise<void> {
  try {
    const res = await
    writeMustacheFile(templates.index, {
      exports: files.map(file => ({
        filepath: file.replace(/\.ts$/, ''),
        filename: file.split('/').pop().replace(/\.ts$/, '')

      })),
      name: 'index'
    }, path)
  } catch(err) {
    console.error(err)
  }
  
}