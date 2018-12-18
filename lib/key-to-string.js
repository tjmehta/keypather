module.exports = function keyToString (key) {
  return typeof key === 'string'
    ? ("'" + key + "'")
    : key
}
