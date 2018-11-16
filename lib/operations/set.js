var debug = require('debug')('keypather:operations:set')
var exists = require('101/exists')

var typeConversionCheck = require('../type-conversion-check')
var isLastKey = require('../is-last-key')
var undefinedErrMessage = require('../error-messages/key-of-undefined')

module.exports = function setOperation (obj, key, state, opts) {
  debug('setOperation %O %O %O', { obj: obj, key: key }, opts, state)
  // if obj exists, set val
  if (exists(obj)) {
    obj = typeConversionCheck(obj, key, state, opts)

    if (isLastKey(state)) {
      debug('SET %O %O %O', obj, state.keypath, state.val)
      obj[key] = state.val
    } else if (!exists(obj[key]) && opts.force) {
      debug('TMP CREATE %O %O %O', obj, key, {}, state.keypath)
      var keypath = state.normalizedKeypath(state.keypathSplit.concat(key))
      state.createOperation.createdKeypaths[keypath] = true
      obj[key] = {}
    }

    return obj[key]
  }

  throw new TypeError(undefinedErrMessage(key, state))
}
