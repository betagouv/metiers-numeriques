import Ministry from '../../../models/Ministry'

export const fakeMinistries = [
  new Ministry({
    description: '<html>1</html>',
    id: 'id2',
  } as any),
  new Ministry({
    description: '<html>2</html>',
    id: 'id2',
  } as any),
]

export const fakeMinistry = fakeMinistries[0]
