const Ministry = require('../../models/Ministry')
const { fakeMinistries } = require('./stubs/fakeMinistries')

describe('Ministries managmenent', () => {
  it('should get the ministries list', async () => {
    const notionMinistry = {
      getAll: () => fakeMinistries,
    }

    const result = await notionMinistry.getAll()

    expect(result).toEqual([
      new Ministry({
        description: '<html>1</html>',
        id: 'id2',
      }),
      new Ministry({
        description: '<html>2</html>',
        id: 'id2',
      }),
    ])
  })
})
