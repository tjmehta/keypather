var exists = require('101/exists')

var getOperation = require('./get.js')
var isLastKey = require('../is-last-key')
var hasErrMessage = require('../error-messages/has-operator')

module.exports = function hasOperation (obj, key, state, opts) {
  // if not last key update ctx using get
  if (!isLastKey(state)) return getOperation(obj, key, state, opts)
  // obj does not exist w/ force, return true
  if (!exists(obj) && opts.force) return false
  // is last key
  try {
    return obj.hasOwnProperty(key)
  } catch (_err) {
    var isError = _err instanceof Error
    var msg = (isError ? _err.message : _err)
    var err = new Error(hasErrMessage(msg, key, state))
    err.source = _err
    throw err
  }
}
