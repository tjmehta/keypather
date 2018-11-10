var throwTemplateError = require('./throw-template-error')

module.exports = function throwUndefinedErr (key, state) {
  throwTemplateError(
    "Cannot read property '$key' of undefined (at keypath '$atKeypath' of '$keypath')",
    key,
    state
  )
}
