import { writeFileSync } from 'fs'
import { incstrBase90, invert, uniq } from '@elzup/kit'
import { compressObj } from '../index'
import { importCsvSong } from './importCsv'

// const normalize = (s: string) => s
const packValues = (vals: string[]) => {
  let i = incstrBase90('0')
  const obj: Record<string, string> = {}

  vals.forEach((v) => {
    obj[i] = v
    i = incstrBase90(i)
  })
  return obj
}

export const main = () => {
  const items = importCsvSong('./out/songs.tsv', '\t')

  console.log(items)

  const firsts = items.map((v) => v.title)
  const lasts = items.map((v) => v.artists.split('、'))

  if (uniq(lasts.flat()).length > 90) throw new Error('too many artists')
  const vlib = packValues(uniq(lasts.flat()))
  const vlibBy = invert(vlib)

  const vs = lasts.map((names) => names.map((n) => vlibBy[n]).join(''))

  const { obj, ents, meta } = compressObj(firsts, vs, 2, 10000)

  writeFileSync('./out/100.csv', ents.map(([k, v]) => `${k},${v}`).join('\n'))
  writeFileSync(
    './out/100.json',
    JSON.stringify({
      __meta: { ...meta, vlib },
      ...obj,
    })
  )
}
main()
