// i just needed a way to create a unique string from keypath split,
// that would not collide with other keypath split strings.
// i didnt want a simple join, as that would be more likely to cause collisions
module.exports = function normalizedKeypath (keypathSplit) {
  return keypathSplit.reduce(function (str, key, i) {
    str += i + ':' + key + ','
    return str
  }, '')
}
