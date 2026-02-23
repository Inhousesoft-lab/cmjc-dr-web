import { useEffect, useId, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormHelperText,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { Delete, UploadFile as UploadFileIcon, ZoomIn, ClearAll, Close } from '@mui/icons-material'

const extOf = (name: string) => {
  const idx = name.lastIndexOf('.')
  return idx >= 0 ? name.slice(idx + 1).toLowerCase() : ''
}
const mb = (bytes: number) => bytes / 1024 / 1024

const isImageExt = (ext: string) => ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext)

const fileKey = (f: File) => `${f.name}__${f.size}__${f.lastModified}`

export type FileUploadFieldProps = {
  label?: string
  required?: boolean
  value: File[]
  onChange: (files: File[]) => void

  helperText?: string
  errorText?: string

  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxFileSizeMB?: number
  maxTotalSizeMB?: number
  allowedExtensions?: string[]

  showImagePreview?: boolean

  /** prevents adding duplicates (same name/size/lastModified) */
  preventDuplicates?: boolean
}

export default function FileUploadField({
  label,
  required = false,
  value,
  onChange,
  helperText,
  errorText,
  accept,
  multiple = true,
  maxFiles,
  maxFileSizeMB,
  maxTotalSizeMB,
  allowedExtensions,
  showImagePreview = true,
  preventDuplicates = true,
}: FileUploadFieldProps) {
  const inputId = useId()
  const [localError, setLocalError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewIdx, setPreviewIdx] = useState<number>(0)

  const totalBytes = useMemo(() => (value ?? []).reduce((sum, f) => sum + (f?.size ?? 0), 0), [value])
  const totalSizeText = totalBytes ? `${mb(totalBytes).toFixed(2)} MB` : ''

  const imagePreviews = useMemo(() => {
    if (!showImagePreview) return []
    return (value ?? [])
      .map((f) => ({ file: f, ext: extOf(f.name) }))
      .filter((x) => isImageExt(x.ext))
      .map((x) => ({ file: x.file, url: URL.createObjectURL(x.file) }))
  }, [value, showImagePreview])

  useEffect(() => {
    return () => {
      imagePreviews.forEach((p) => URL.revokeObjectURL(p.url))
    }
  }, [imagePreviews])

  const validate = (files: File[]) => {
    const list = files ?? []
    if (maxFiles && list.length > maxFiles) return `첨부파일은 최대 ${maxFiles}개까지 가능합니다.`
    if (allowedExtensions?.length) {
      const allowed = allowedExtensions.map((e) => e.toLowerCase().replace('.', ''))
      const bad = list.find((f) => {
        const ext = extOf(f.name)
        return ext && !allowed.includes(ext)
      })
      if (bad) return `허용되지 않는 파일 형식입니다: ${bad.name}`
    }
    if (maxFileSizeMB) {
      const bad = list.find((f) => mb(f.size) > maxFileSizeMB)
      if (bad) return `파일 용량이 너무 큽니다(최대 ${maxFileSizeMB}MB): ${bad.name}`
    }
    if (maxTotalSizeMB) {
      const total = list.reduce((sum, f) => sum + f.size, 0)
      if (mb(total) > maxTotalSizeMB) return `총 첨부 용량이 너무 큽니다(최대 ${maxTotalSizeMB}MB).`
    }
    return null
  }

  const addFiles = (incoming: File[]) => {
    if (!incoming.length) return

    const base = value ?? []
    const nextRaw = [...base, ...incoming]

    const next = preventDuplicates
      ? Array.from(
          new Map(nextRaw.map((f) => [fileKey(f), f])).values(),
        )
      : nextRaw

    const msg = validate(next)
    if (msg) {
      setLocalError(msg)
      return
    }
    setLocalError(null)
    onChange(next)
  }

  const removeAt = (idx: number) => {
    const next = (value ?? []).filter((_, i) => i !== idx)
    setLocalError(null)
    onChange(next)
  }

  const clearAll = () => {
    setLocalError(null)
    onChange([])
  }

  const openPreviewByUrl = (url: string) => {
    const i = imagePreviews.findIndex((p) => p.url === url)
    setPreviewIdx(Math.max(0, i))
    setPreviewOpen(true)
  }

  const constraintsText = useMemo(() => {
    const chips: string[] = []
    if (allowedExtensions?.length) chips.push(`허용: ${allowedExtensions.join(', ')}`)
    if (maxFiles) chips.push(`최대 ${maxFiles}개`)
    if (maxFileSizeMB) chips.push(`개별 ${maxFileSizeMB}MB`)
    if (maxTotalSizeMB) chips.push(`총 ${maxTotalSizeMB}MB`)
    return chips.join(' · ')
  }, [allowedExtensions, maxFiles, maxFileSizeMB, maxTotalSizeMB])

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          {label && (
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {label}{required ? ' *' : ''}
            </Typography>
          )}
          <Button
            variant="contained"
            size="small"
            startIcon={<UploadFileIcon />}
            onClick={() => document.getElementById(inputId)?.click()}
          >
            파일 선택
          </Button>
          {!!(value?.length) && (
            <Tooltip title="전체 삭제">
              <IconButton size="small" onClick={clearAll}>
                <ClearAll fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        {totalSizeText && (
          <Typography variant="caption" color="text.secondary">
            총 용량: {totalSizeText}
          </Typography>
        )}
      </Stack>

      <input
        id={inputId}
        type="file"
        hidden
        aria-label={label || '파일 업로드'}
        title={label || '파일 업로드'}
        multiple={multiple}
        accept={accept}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? [])
          // reset so selecting same file again triggers change event
          e.currentTarget.value = ''
          addFiles(files)
        }}
      />

      <Paper
        variant="outlined"
        sx={{
          p: 1.5,
          borderStyle: 'dashed',
          cursor: 'pointer',
          transition: 'all 120ms ease',
          ...(dragActive
            ? { borderColor: 'primary.main', bgcolor: 'action.hover' }
            : { borderColor: 'divider', bgcolor: 'background.paper' }),
        }}
        onDragEnter={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setDragActive(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setDragActive(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setDragActive(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setDragActive(false)
          const files = Array.from(e.dataTransfer.files ?? [])
          addFiles(files)
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') document.getElementById(inputId)?.click()
        }}
        onClick={() => document.getElementById(inputId)?.click()}
      >
        <Typography variant="body2" color="text.secondary">
          파일을 이 영역에 드래그&드롭 하거나 클릭해서 선택하세요.
        </Typography>
        {constraintsText && (
          <Typography variant="caption" color="text.secondary">
            {constraintsText}
          </Typography>
        )}
        {preventDuplicates && (
          <Typography variant="caption" color="text.secondary">
            중복 파일은 자동으로 제거됩니다.
          </Typography>
        )}
      </Paper>

      {!!(imagePreviews.length) && (
        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
          {imagePreviews.map((p) => (
            <Box key={p.url} sx={{ position: 'relative' }}>
              <Box
                component="img"
                src={p.url}
                alt={p.file.name}
                sx={{
                  width: 88,
                  height: 88,
                  objectFit: 'cover',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
              <Tooltip title="미리보기 확대">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    openPreviewByUrl(p.url)
                  }}
                  sx={{
                    position: 'absolute',
                    right: 4,
                    bottom: 4,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <ZoomIn fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
        </Stack>
      )}

      {!!(value?.length) && (
        <List dense sx={{ mt: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          {value.map((f, idx) => (
            <ListItem
              key={fileKey(f)}
              divider={idx < value.length - 1}
              secondaryAction={
                <Tooltip title="삭제">
                  <IconButton edge="end" size="small" onClick={() => removeAt(idx)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              }
            >
              <ListItemText
                primary={f.name}
                secondary={`${mb(f.size).toFixed(2)} MB`}
                primaryTypographyProps={{ noWrap: true }}
              />
            </ListItem>
          ))}
        </List>
      )}

      {(errorText || localError || helperText) && (
        <FormHelperText error={!!(errorText || localError)} sx={{ mt: 0.5 }}>
          {errorText ?? localError ?? helperText}
        </FormHelperText>
      )}

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pr: 6 }}>
          이미지 미리보기
          <IconButton
            size="small"
            onClick={() => setPreviewOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            aria-label="close"
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {imagePreviews.length ? (
            <Stack spacing={1.5}>
              <Box
                component="img"
                src={imagePreviews[Math.min(previewIdx, imagePreviews.length - 1)].url}
                alt={imagePreviews[Math.min(previewIdx, imagePreviews.length - 1)].file.name}
                sx={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
              />
              <Divider />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }} justifyContent="space-between">
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {imagePreviews[Math.min(previewIdx, imagePreviews.length - 1)].file.name}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    disabled={previewIdx <= 0}
                    onClick={() => setPreviewIdx((i) => Math.max(0, i - 1))}
                  >
                    이전
                  </Button>
                  <Button
                    size="small"
                    disabled={previewIdx >= imagePreviews.length - 1}
                    onClick={() => setPreviewIdx((i) => Math.min(imagePreviews.length - 1, i + 1))}
                  >
                    다음
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              미리볼 이미지가 없습니다.
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}
