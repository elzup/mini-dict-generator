import { writeFileSync } from 'fs'
import { compressObj } from '../index'
import { importCsv } from './importCsv'

export const main = () => {
  const items = importCsv('./out/hyakunin-issyu.csv')

  const firsts = items.map((v) => v.first)
  const lasts = items.map((v) => v.last)

  const { obj, ents, meta } = compressObj(firsts, lasts)

  writeFileSync('./out/100.csv', ents.map(([k, v]) => `${k},${v}`).join('\n'))
  writeFileSync(
    './out/100.json',
    JSON.stringify({
      __meta: meta,
      ...obj,
    })
  )
}
main()
