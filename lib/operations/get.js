var exists = require('101/exists')
var undefinedErrMessage = require('../error-messages/key-of-undefined')

module.exports = function getOperation (obj, key, state, opts) {
  // if obj exists
  if (exists(obj)) return obj[key]
  // obj does not exist
  if (opts.force) return undefined
  // obj does not exist, and no "force"
  throw new TypeError(undefinedErrMessage(key, state))
}
