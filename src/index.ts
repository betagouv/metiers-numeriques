import ß from 'bhala'

import server from './server'

const port = process.env.APP_PORT || process.env.PORT || 8080

server.listen(port, () => {
  ß.info(`Server listening at http://localhost:${port}`)
})
