var stateToAtKeypath = require('../state-to-at-keypath')

module.exports = function keyOfUndefinedErrorMessage (key, obj, state) {
  var atKeypath = stateToAtKeypath(state)
  return "Cannot use 'in' operator to search for '$key' in $obj (at '$atKeypath' of '$keypath')"
    .replace(/\$atKeypath/g, atKeypath)
    .replace(/\$keypath/g, state.keypath)
    .replace(/\$key/g, key)
    .replace(/\$obj/g, obj + '')
}
