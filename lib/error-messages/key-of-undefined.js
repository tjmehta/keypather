var stateToAtKeypath = require('../state-to-at-keypath')

module.exports = function keyOfUndefinedErrorMessage (key, state) {
  var atKeypath = stateToAtKeypath(state)
  return "Cannot read property '$key' of undefined (at keypath '$atKeypath' of '$keypath')"
    .replace(/\$atKeypath/g, atKeypath)
    .replace(/\$keypath/g, state.keypath)
    .replace(/\$key/g, key)
}
