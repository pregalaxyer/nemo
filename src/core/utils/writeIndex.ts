import { writeMustacheFile } from './files'
export async function writeIndex(
  files: string[],
  templete: Record<string, string>,
  path: string,
): Promise<void> {
  console.log('files', files)
  try {
    const res = await
    writeMustacheFile(templete.index, {
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