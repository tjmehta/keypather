var debug = require('debug')('keypather:operations:set')
var exists = require('101/exists')
var last = require('101/last')

var arrayConversionCheck = require('../array-conversion-check')
var isLastKey = require('../is-last-key')
var normalizedKeypath = require('../normalized-keypath')
var undefinedErrMessage = require('../error-messages/key-of-undefined')

module.exports = function immutableSetOperation (obj, key, state, opts) {
  debug('immutableSetOperation %O %O %O', { obj: obj, key: key }, opts, state)

  if (exists(obj)) {
    // check if an array key is being set on a created object,
    // if it is convert the created object to an array
    obj = arrayConversionCheck(obj, key, state, opts)
    // if obj exists, clone it and set key (or just get it)
    var clonedObj = shallowCloneObj(obj, key, state, opts)

    if (isLastKey(state)) {
      debug('SET %O %O %O', obj, key, state.keypath, state.val, state.createOperation.createdKeypaths)
      clonedObj[key] = global.val = state.val
      // on the last loop, return the root object (previously shallow cloned)
      return state.rootCtx
    } else if (!exists(clonedObj[key]) && opts.force) {
      debug('TMP CREATE %O %O %O', obj, key, {}, state.keypath)
      var keypath = normalizedKeypath(state.keypathSplit.concat(key))
      state.createOperation.createdKeypaths[keypath] = true
      clonedObj[key] = {}
    }

    return clonedObj[key]
  }

  throw new TypeError(undefinedErrMessage(key, state))
}

function shallowCloneObj (_obj, key, state, opts, log) {
  var obj = opts.shallowClone(_obj)

  if (state.ctx === state.rootCtx) {
    // root object
    state.rootCtx = state.ctx = obj
  } else {
    // not root object
    var objKey = last(state.keypathSplit)
    debug(state.keypathSplit)
    state.parentCtx[objKey] = state.ctx = obj
  }

  return obj
}
