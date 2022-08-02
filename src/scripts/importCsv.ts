import { readFileSync } from 'fs'

export const importCsv = (path: string, separator = ',') => {
  const data = readFileSync(path, 'utf8')
  const lines = data.trim().split('\n')

  lines.shift()
  return lines.map((v) => v.split(separator))
}
export const importCsvHyaku = (path: string, separator = ',') =>
  importCsv(path, separator).map(([id, first, last, author]) => ({
    id,
    first,
    last,
    author,
  }))
export const importCsvSong = (path: string, separator = ',') =>
  importCsv(path, separator).map(([title, artists]) => ({ title, artists }))
