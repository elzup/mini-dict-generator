import { writeFileSync } from 'fs'
import { compressObjArr } from '../index'
import { importCsvHyaku } from './importCsv'

export const main = () => {
  const items = importCsvHyaku('./out/hyakunin-issyu.csv')

  const firsts = items.map((v) => v.first)
  const lasts = items.map((v) => v.last)

  const { obj, ents, meta } = compressObjArr(firsts, lasts, 2, 10000)

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
