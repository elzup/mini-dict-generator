import { compressKeys, compressObj } from '..'

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
    const res = compressKeys(['a', 'ほげ', 'b', ',#/', 'ふが'], {
      expectLen: 1,
    })

    expect(res).toStrictEqual({
      salt: 'AQ',
      len: 1,
      skeys: ['A', 'Q', 'S', 'u', 'M'],
    })
  })
  it('non uniq', () => {
    expect(() => compressKeys(['a', 'b', 'a'])).toThrow('not uniq keys')
  })
  it('with shortifyFrom', () => {
    expect(() =>
      compressKeys(['a', 'ほげ', 'b', ',#/', 'ふが'], {
        expectLen: 6,
        shortifyFrom: 7,
      })
    ).toThrow('need shortifyFrom (7) < expectLen (6)')
    expect(
      compressKeys(['a', 'ほげ', 'b', ',#/', 'ふが'], {
        expectLen: 7,
        shortifyFrom: 6,
      })
    ).toStrictEqual({
      len: 6,
      salt: 'AA',
      skeys: ['gb2HcM', 'Nfbff1', 'EVBDMF', 'N64gRq', 'TR6AAC'],
    })
  })
})

describe('compressObj', () => {
  it('compress', () => {
    expect(
      compressObj(['a', 'ほげ', 'b', ',#/', 'ふが'], ['A', 'B', 'C', 'D', 'E'])
    ).toStrictEqual({
      ents: [
        ['gb', 'A'],
        ['Nf', 'B'],
        ['EV', 'C'],
        ['N6', 'D'],
        ['TR', 'E'],
      ],
      meta: { len: 2, salt: 'AA' },
      obj: { EV: 'C', N6: 'D', Nf: 'B', TR: 'E', gb: 'A' },
    })
  })
  it('with overwrite', () => {
    const res = compressObj(['a', 'b', 'b'], ['A', 'B', 'C'], {
      expectLen: 2,
      pressUnUniqKeys: true,
    })

    expect(res).toStrictEqual({
      ents: [
        ['g', 'A'],
        ['E', 'C'],
      ],
      meta: { len: 1, salt: 'AA' },
      obj: { E: 'C', g: 'A' },
    })
  })
})
