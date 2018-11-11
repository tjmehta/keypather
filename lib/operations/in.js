var exists = require('101/exists')

var getOperation = require('./get.js')
var isLastKey = require('../is-last-key')
var inErrMessage = require('../error-messages/in-operator')

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
    throw new TypeError(inErrMessage(key, obj, state))
  }
}
