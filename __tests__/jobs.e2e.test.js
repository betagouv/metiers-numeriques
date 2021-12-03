const axios = require('axios')

const server = require('../build/server')

describe('Displaying jobs on website', () => {
  const port = 8888

  beforeAll(() => {
    server.default.listen(port)
  })

  afterAll(() => {
    process.exit()
  })

  it('should display the list of jobs', async () => {
    const response = await axios.get(`http://localhost:${port}/emplois`)
    expect(response.status).toEqual(200)
    expect(response.data).toContain('<html')
  })
})
