import { fakeMinistries } from './stubs/fakeMinistries'

describe('Ministries managmenent', () => {
  it('should get the ministries list', async () => {
    const notionMinistry = {
      getAll: () => fakeMinistries,
    }

    const result = await notionMinistry.getAll()

    expect(result).toMatchObject([
      {
        description: '<html>1</html>',
        id: 'id2',
      },
      {
        description: '<html>2</html>',
        id: 'id2',
      },
    ])
  })
})
