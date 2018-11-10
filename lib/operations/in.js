var exists = require('101/exists')

var getOperation = require('./get.js')
var isLastKey = require('../is-last-key')
var throwTemplateError = require('../throw-template-error')

module.exports = function inOperation (obj, key, state, opts) {
  if (!isLastKey(state)) {
    return getOperation(obj, key, state, opts)
  }
  if (exists(obj)) {
    return key in obj
  } else if (opts.force) {
    return false
  } else {
    // no obj, no force
    throwTemplateError(
      "Cannot use 'in' operator to search for '$key' in " + obj + " (at '$atKeypath' of '$keypath')",
      key,
      state
    )
  }
}
