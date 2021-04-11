import { writeMustacheFile } from './files'
export async function writeIndex(
  files: string[],
  templete: Record<string, string>,
  path: string,
): Promise<void> {
  try {
    const res = await
    writeMustacheFile(templete.index, {
      exports: files,
      name: 'index'
    }, path)
  } catch(err) {
    console.error(err)
  }
  
}