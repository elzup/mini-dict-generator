import { compressKeys } from '.'

const _d = {
  abc: ['a', 'b', 'c'],
  def: ['d', 'e', 'f'],
  'cde-opt': ['c', 'd', 'e', 'f', 'g'],
  other: ['d', 'e', 'f'],
}
// test('', () => {
//   const dict = m(d)

//   expect(dict.get('abc')).toEqual(['a', 'b', 'c'])
// })

test('compressKeys', () => {
  const res = compressKeys(['a', 'ほげ', 'b', ',#/', 'ふが'])

  console.log(res)

  expect(res).toStrictEqual({
    salt: '5w',
    len: 1,
    skeys: ['a', '7', 'S', 'C', 'D'],
  })
})
