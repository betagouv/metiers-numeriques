const fixedDateProvider = {
  date: date => date,
}

const systemDateProvider = {
  date: () => new Date(),
}

module.exports = {
  fixedDateProvider,
  systemDateProvider,
}
