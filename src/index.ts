import { writeFileSync } from 'fs'
import { hash } from '@elzup/kit/lib/hash'
import { rangeAdv } from '@elzup/kit/lib/rangeAdv'
import { importCsv } from './loadData'

export const shortifyKeys = (keys: string[]) => {
  for (const len of rangeAdv(1, keys[0].length)) {
    const skeys = keys.map((k) => k.substring(0, len))

    if (skeys.length === new Set(skeys).size) {
      return { skeys, len }
    }
  }
  return false
}

type CompressedResult = { skeys: string[]; salt: string; len: number }
export const compressKeys = (keys: string[]): CompressedResult => {
  const better: CompressedResult = { salt: '', len: 0, skeys: [] }

  for (let i = 0; i < 1000; i++) {
    const salt = Buffer.from(new Uint8Array([i]).buffer).toString('base64url')

    if (salt.length > 2) break
    const longKeys = keys.map((s) => hash(`${salt}${s}`, 'md5', 'base64'))

    const res = shortifyKeys(longKeys)

    if (res === false) {
      continue
    }
    better.skeys = res.skeys
    better.len = res.len
    better.salt = salt
  }

  return better
}

export const main = () => {
  const items = importCsv()

  const firsts = items.map((v) => v.first)
  const lasts = items.map((v) => v.last)

  const { skeys, len, salt } = compressKeys(firsts)

  const ents = skeys.map((k, i) => [k, lasts[i]])

  writeFileSync('./out/100.csv', ents.map(([k, v]) => `${k},${v}`).join('\n'))
  writeFileSync(
    './out/100.json',
    JSON.stringify({
      __len: len,
      __salt: salt,
      ...Object.fromEntries(ents),
    })
  )
}
main()
