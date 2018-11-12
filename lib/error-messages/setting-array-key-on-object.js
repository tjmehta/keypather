var stateToAtKeypath = require('../state-to-at-keypath')

module.exports = function settingArrayKeyOnObjectWarning (key, state) {
  var atKeypath = stateToAtKeypath(state)
  return "Setting number key ($key) on object at keypath '$atKeypath' of '$keypath')"
    .replace(/\$atKeypath/g, atKeypath)
    .replace(/\$keypath/g, state.keypath)
    .replace(/\$key/g, key)
}
