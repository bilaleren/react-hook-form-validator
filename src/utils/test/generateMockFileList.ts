import createFileList, { FakeFileList } from './createFileList'

function generateMockFileList(length: number): FakeFileList {
  const files: File[] = []

  for (let i = 0; i < length; i++) {
    files.push(
      new File(['text file'], `foo${i}.txt`, {
        type: 'plain/text'
      })
    )
  }

  return createFileList(files)
}

export default generateMockFileList
