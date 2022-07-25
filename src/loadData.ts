import { readFileSync } from 'fs'

export const importCsv = () => {
  const data = readFileSync('./out/hyakunin-issyu.csv', 'utf8')
  const lines = data.trim().split('\n')

  lines.shift()
  return lines
    .map((v) => v.split(','))
    .map(([id, first, last, author]) => ({ id, first, last, author }))
}
