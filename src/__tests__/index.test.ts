import { compressKeys } from '..'

// const _d = {
//   abc: ['a', 'b', 'c'],
//   def: ['d', 'e', 'f'],
//   'cde-opt': ['c', 'd', 'e', 'f', 'g'],
//   other: ['d', 'e', 'f'],
// }
// test('', () => {
//   const dict = m(d)

//   expect(dict.get('abc')).toEqual(['a', 'b', 'c'])
// })

describe('compressKeys', () => {
  it('compress', () => {
    expect(compressKeys(['a', 'ほげ', 'b', ',#/', 'ふが'])).toStrictEqual({
      len: 2,
      salt: 'AA',
      skeys: ['gb', 'Nf', 'EV', 'N6', 'TR'],
    })
  })
  it('compressKeys expectLen', () => {
    const res = compressKeys(['a', 'ほげ', 'b', ',#/', 'ふが'], 1)

    expect(res).toStrictEqual({
      salt: 'AQ',
      len: 1,
      skeys: ['A', 'Q', 'S', 'u', 'M'],
    })
  })
  it('non uniq', () => {
    expect(() => compressKeys(['a', 'b', 'a'])).toThrow('not uniq keys')
  })
})
