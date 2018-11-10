var debug = require('debug')('keypather:operations:set')
var exists = require('101/exists')

var createOperation = require('./create')
var isLastKey = require('../is-last-key')
var normalizedKeypath = require('../normalized-keypath')
var throwUndefinedErr = require('../throw-undefined-error')

module.exports = function setOperation (obj, key, state, opts) {
  debug('setOperation %O %O %O', { obj: obj, key: key }, opts, state)
  // if obj does not exist and opts.force, create
  if (opts.force) obj = createOperation(obj, key, state, opts)
  // if obj exists, set val
  if (exists(obj)) {
    if (isLastKey(state)) {
      debug('SET %O %O %O', obj, state.keypath, state.val)
      obj[key] = state.val
    } else if (opts.force) {
      debug('TMP CREATE %O %O %O', obj, key, {}, state.keypath)
      var keypath = normalizedKeypath(state.keypathSplit.concat(key))
      state.createOperation.createdKeypaths[keypath] = true
      obj[key] = obj[key] || {}
    }
    return obj[key]
  }
  throwUndefinedErr(key, state)
}
