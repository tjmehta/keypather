var stateToAtKeypath = require('../state-to-at-keypath')

module.exports = function keyOfUndefinedErrorMessage (msg, key, state) {
  var atKeypath = stateToAtKeypath(state)
  return "$msg (hasOwnProperty('$key') errored at keypath '$atKeypath' of '$keypath')"
    .replace(/\$atKeypath/g, atKeypath)
    .replace(/\$keypath/g, state.keypath)
    .replace(/\$key/g, key)
    .replace(/\$msg/g, msg + '')
}
