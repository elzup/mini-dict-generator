import { uniq } from '@elzup/kit'
import { hash } from '@elzup/kit/lib/hash'
import { rangeAdv } from '@elzup/kit/lib/rangeAdv'

const isUniq = (a: any[]) => uniq(a).length === a.length

export const shortifyKeys = (keys: string[], from = 1) => {
  for (const len of rangeAdv(from, keys[0].length)) {
    const skeys = keys.map((k) => k.substring(0, len))

    if (skeys.length !== new Set(skeys).size) continue
    return { skeys, len }
  }
  return false
}

type CompressedResult = { skeys: string[]; salt: string; len: number }
type CompressKeyOpts = {
  expectLen?: number
  tryCount?: number
  shortifyFrom?: number
}
export const compressKeys = (
  keys: string[],
  { expectLen = 2, tryCount = 1000, shortifyFrom = 1 }: CompressKeyOpts = {}
): CompressedResult => {
  if (!isUniq(keys)) throw new Error('not uniq keys')

  if (shortifyFrom > expectLen)
    throw new Error(
      `need shortifyFrom (${shortifyFrom}) < expectLen (${expectLen})`
    )

  const better: CompressedResult = { salt: '', len: Infinity, skeys: [] }

  for (let i = 0; i < tryCount; i++) {
    const salt = Buffer.from(new Uint8Array([i]).buffer).toString('base64url')

    if (salt.length > 2) break
    const longKeys = keys.map((s) => hash(`${salt}${s}`, 'md5', 'base64'))

    const res = shortifyKeys(longKeys, shortifyFrom)

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

const kvCheck = (
  keys: string[],
  values: string[],
  pressUnUniqKeys: boolean
) => {
  if (isUniq(keys)) return [keys, values]

  if (!pressUnUniqKeys)
    throw new Error('not uniq keys (if pressUnUniqKeys: true overwrite keys)')
  const obj: Record<string, string> = {}

  keys.forEach((k, i) => (obj[k] = values[i]))
  return [Object.keys(obj), Object.values(obj)]
}

type CompressObjOpts = CompressKeyOpts & {
  pressUnUniqKeys?: boolean
}

export const compressObj = (
  keys: string[],
  values: string[],
  { pressUnUniqKeys = false, ...kopts }: CompressObjOpts = {}
) => {
  const [keys2, values2] = kvCheck(keys, values, pressUnUniqKeys)
  const { skeys, len, salt } = compressKeys(keys2, kopts)

  const ents = skeys.map((k, i) => [k, values2[i]])
  const obj = Object.fromEntries(ents)

  return { ents, obj, meta: { len, salt } }
}
