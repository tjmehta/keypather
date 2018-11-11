var dotNotationKey = /^[A-Za-z_$][A-Za-z0-9_$]{0,}$/

module.exports = function keyRequiresBracketNotation (key) {
  return !dotNotationKey.test(key)
}
