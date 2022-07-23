const d = {
  abc: ['a', 'b', 'c'],
  def: ['d', 'e', 'f'],
  'cde-opt': ['c', 'd', 'e', 'f', 'g'],
  other: ['d', 'e', 'f'],
}
test('', () => {
  const dict = m(d)

  expect(dict.get('abc')).toEqual(['a', 'b', 'c'])
})
