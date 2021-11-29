const Ministry = require('../../../models/Ministry')

const fakeMinistries = [
  new Ministry({
    description: '<html>1</html>',
    id: 'id2',
  }),
  new Ministry({
    description: '<html>2</html>',
    id: 'id2',
  }),
]

const fakeMinistry = fakeMinistries[0]

module.exports = {
  fakeMinistries,
  fakeMinistry,
}
