var keyToString = require('../key-to-string')
var stateToAtKeypath = require('../state-to-at-keypath')

module.exports = function keyOfUndefinedErrorMessage (key, state) {
  var atKeypath = stateToAtKeypath(state)
  return "Cannot read property $keyStr of undefined (at keypath '$atKeypath' of '$keypath')"
    .replace(/\$atKeypath/, atKeypath)
    .replace(/\$keypath/, state.keypath)
    .replace(/\$keyStr/, keyToString(key))
}
