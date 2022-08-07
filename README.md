## make hash table

## make lib

```ts
const { obj, meta } = compressObj({
  monday: 'O',
  tuesday: 'R',
  wednesday: 'D',
  thursday: 'D',
  friday: 'E',
  saturday: 'R',
  sunday: 'S',
})
// {
//   meta: { len: 1, salt: 'AA' },
//   obj: { N: 'O', a: 'D', j: 'S', l: 'R', r: 'E', w: 'D', x: 'R' },
// }
```

## use lib

```ts
const hash = (s: string) => createHash('md5').update(s).digest('base64')
const getValue = (key: string) =>
  obj[hash(`${meta.salt}${key}`).substring(0, meta.len)]

getValue('monday')
// => "O"
```
