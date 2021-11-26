module.exports = function uncapitalizeFirstLetter(text) {
  return text.charAt(0).toLocaleLowerCase() + text.slice(1)
}
