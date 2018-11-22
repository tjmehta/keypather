var keyToString = require('../key-to-string')
var stateToAtKeypath = require('../state-to-at-keypath')

module.exports = function keyOfUndefinedErrorMessage (msg, key, state) {
  var atKeypath = stateToAtKeypath(state)
  return "$msg (hasOwnProperty($keyStr) errored at keypath '$atKeypath' of '$keypath')"
    .replace(/\$atKeypath/, atKeypath)
    .replace(/\$keypath/, state.keypath)
    .replace(/\$keyStr/, keyToString(key))
    .replace(/\$msg/, msg + '')
}
