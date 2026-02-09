export type FileRuleOptions = {
  maxFiles?: number
  maxTotalSizeMB?: number
  maxFileSizeMB?: number
  allowedExtensions?: string[] // e.g. ['jpg','png','pdf']
}

const mb = (bytes: number) => bytes / (1024 * 1024)

export function validateFiles(files: File[], opts: FileRuleOptions) {
  const list = files ?? []
  if (opts.maxFiles && list.length > opts.maxFiles) {
    return `첨부파일은 최대 ${opts.maxFiles}개까지 가능합니다.`
  }

  if (opts.allowedExtensions?.length) {
    const allowed = opts.allowedExtensions.map((e) => e.toLowerCase())
    const bad = list.find((f) => {
      const ext = (f.name.split('.').pop() ?? '').toLowerCase()
      return ext && !allowed.includes(ext)
    })
    if (bad) return `허용되지 않는 파일 형식입니다: ${bad.name}`
  }

  if (opts.maxFileSizeMB) {
    const bad = list.find((f) => mb(f.size) > opts.maxFileSizeMB!)
    if (bad) return `파일 용량은 개별 ${opts.maxFileSizeMB}MB 이하만 가능합니다: ${bad.name}`
  }

  if (opts.maxTotalSizeMB) {
    const total = list.reduce((sum, f) => sum + (f?.size ?? 0), 0)
    if (mb(total) > opts.maxTotalSizeMB) return `총 첨부 용량은 ${opts.maxTotalSizeMB}MB 이하만 가능합니다.`
  }

  return null
}
