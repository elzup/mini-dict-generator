import { hash } from '@elzup/kit/lib/hash'
import { rangeAdv } from '@elzup/kit/lib/rangeAdv'

export const shortifyKeys = (keys: string[]) => {
  for (const len of rangeAdv(1, keys[0].length)) {
    const skeys = keys.map((k) => k.substring(0, len))

    if (skeys.length !== new Set(skeys).size) continue
    return { skeys, len }
  }
  return false
}

type CompressedResult = { skeys: string[]; salt: string; len: number }
export const compressKeys = (
  keys: string[],
  expectLen = 2,
  tryCount = 1000
): CompressedResult => {
  const better: CompressedResult = { salt: '', len: Infinity, skeys: [] }

  for (let i = 0; i < tryCount; i++) {
    const salt = Buffer.from(new Uint8Array([i]).buffer).toString('base64url')

    if (salt.length > 2) break
    const longKeys = keys.map((s) => hash(`${salt}${s}`, 'md5', 'base64'))

    const res = shortifyKeys(longKeys)

    if (res === false) continue

    if (better.len > res.len) {
      better.skeys = res.skeys
      better.len = res.len
      better.salt = salt
    }
    if (expectLen >= res.len) break
  }

  return better
}

export const compressObj = (
  keys: string[],
  values: string[],
  expectLen: number,
  tryCount: number
) => {
  const { skeys, len, salt } = compressKeys(keys, expectLen, tryCount)

  const ents = skeys.map((k, i) => [k, values[i]])
  const obj = Object.fromEntries(ents)

  return { ents, obj, meta: { len, salt } }
}
