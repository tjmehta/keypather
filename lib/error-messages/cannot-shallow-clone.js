var stateToAtKeypath = require('../state-to-at-keypath')

module.exports = function cannotShallowClone (value, state, isDefault) {
  var atKeypath = stateToAtKeypath(state)
  var extra = isDefault ? ' (use opts.shallowClone for advanced cloning)' : ''
  return "Shallow clone returned original value ($value) at keypath '$atKeypath' of '$keypath'$extra"
    .replace(/\$atKeypath/, atKeypath)
    .replace(/\$keypath/, state.keypath)
    .replace(/\$value/, value)
    .replace(/\$extra/, extra)
}
