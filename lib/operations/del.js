var exists = require('101/exists')

var getOperation = require('./get.js')
var undefinedErrMessage = require('../error-messages/key-of-undefined')

module.exports = function delOperation (obj, key, state, opts) {
  if (state.i < state.keypath.length - 1) {
    return getOperation(obj, key, state, opts)
  }
  if (exists(obj)) {
    return delete obj[key]
  } else if (opts.force) {
    // no obj, force del returns true
    return true
  } else {
    // no obj, no force
    throw new TypeError(undefinedErrMessage(key, state))
  }
}
