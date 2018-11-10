var stateToAtKeypath = require('./state-to-at-keypath')

module.exports = function throwTemplateError (template, key, state, ErrorClass) {
  ErrorClass = ErrorClass || TypeError
  var atKeypath = stateToAtKeypath(state)
  var msg = template
    .replace(/\$keypath/g, state.keypath)
    .replace(/\$atKeypath/g, atKeypath)
    .replace(/\$key/g, key)
  throw new ErrorClass(msg)
}
