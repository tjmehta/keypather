var keyToString = require('../key-to-string')
var stateToAtKeypath = require('../state-to-at-keypath')

module.exports = function keyOfUndefinedErrorMessage (key, obj, state) {
  var atKeypath = stateToAtKeypath(state)
  return "Cannot use 'in' operator to search for $keyStr in $obj (at '$atKeypath' of '$keypath')"
    .replace(/\$atKeypath/, atKeypath)
    .replace(/\$keypath/, state.keypath)
    .replace(/\$keyStr/, keyToString(key))
    .replace(/\$obj/, obj + '')
}
