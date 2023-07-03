export class FakeFileList implements FileList {
  [index: number]: File

  readonly length: number

  constructor(private readonly files: File[]) {
    this.length = files.length

    for (let i = 0; i < files.length; i++) {
      this[i] = files[i]
    }
  }

  *[Symbol.iterator](): IterableIterator<File> {
    for (const file of this.files) {
      yield file
    }
  }

  item(index: number): File | null {
    return this.files[index] || null
  }

  get [Symbol.toStringTag](): string {
    return 'FileList'
  }
}

function createFileList(files: File[]): FakeFileList {
  return new FakeFileList(files)
}

export default createFileList
