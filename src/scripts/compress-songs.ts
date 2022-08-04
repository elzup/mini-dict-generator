import { writeFileSync } from 'fs'
import { halfWidth, halfySigns, incstrBase62, invert, uniq } from '@elzup/kit'
import { compressObj } from '../index'
import { importCsvSong } from './importCsv'

const titleNormalize = (title: string) => halfySigns(halfWidth(title))

// const normalize = (s: string) => s
const packValues = (vals: string[]) => {
  let i = incstrBase62('0')
  const obj: Record<string, string> = {}

  vals.forEach((v) => {
    obj[i] = v
    i = incstrBase62(i)
  })
  return obj
}
const parseArtists = (artists: string) =>
  artists
    .replace(/^"/, '')
    .replace(/"$/, '')
    .replace(/.*\(/, '')
    .replace(/\).*/, '')
    .trim()
    .split('、')
    .map((v) => v.trim())

export const main = () => {
  const items = importCsvSong('./out/songs.tsv', '\t')

  const firsts = items.map((v) => titleNormalize(v.title))
  const lasts = items.map((v) => parseArtists(v.artists))

  if (uniq(lasts.flat()).length > 90) throw new Error('too many artists')
  const vlib = packValues(uniq(lasts.flat()))
  const vlibBy = invert(vlib)

  const vs = lasts.map((names) => names.map((n) => vlibBy[n]).join('_'))

  const { obj, ents, meta } = compressObj(firsts, vs, 2, 10000, true)

  writeFileSync(
    './out/songs.min.tsv',
    ents.map(([k, v]) => `${k}\t${v}`).join('\n')
  )
  writeFileSync(
    './out/songs.min.json',
    JSON.stringify({
      __meta: { ...meta, vlib },
      ...obj,
    })
  )
}
main()
