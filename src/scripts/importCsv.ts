import { readFileSync } from 'fs'

export const importCsv = (path: string) => {
  const data = readFileSync(path, 'utf8')
  const lines = data.trim().split('\n')

  lines.shift()
  return lines
    .map((v) => v.split(','))
    .map(([id, first, last, author]) => ({ id, first, last, author }))
}
