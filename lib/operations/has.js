var exists = require('101/exists')

var getOperation = require('./get.js')
var isLastKey = require('../is-last-key')
var throwTemplateError = require('../throw-template-error')

module.exports = function hasOperation (obj, key, state, opts) {
  // if not last key update ctx using get
  if (!isLastKey(state)) return getOperation(obj, key, state, opts)
  // obj does not exist w/ force, return true
  if (!exists(obj) && opts.force) return false
  // is last key
  try {
    return obj.hasOwnProperty(key)
  } catch (err) {
    var isError = err instanceof Error
    var errMessage = (isError ? err.message : err)
    throwTemplateError(
      errMessage + " (hasOwnProperty('$key') errored at keypath '$atKeypath' of '$keypath')",
      key,
      state,
      isError ? err.constructor : Error
    )
  }
}
