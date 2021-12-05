import Institution from '../../../models/Institution'

export const fakeMinistries = [
  new Institution({
    description: '<html>1</html>',
    id: 'id2',
  } as any),
  new Institution({
    description: '<html>2</html>',
    id: 'id2',
  } as any),
]

export const fakeMinistry = fakeMinistries[0]
