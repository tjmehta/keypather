var debug = require('debug')('keypather:operations:set')
var exists = require('101/exists')
var last = require('101/last')

var getOperation = require('./get.js')
var undefinedErrMessage = require('../error-messages/key-of-undefined')

module.exports = function immutableDelOperation (obj, key, state, opts) {
  debug('immutableDelOperation %O %O %O', { obj: obj, key: key }, opts, state)
  var objExists = exists(obj)
  var objKeypath = state.normalizedKeypath()
  var clonedObj = objExists && !state.createOperation.createdKeypaths[objKeypath]
    // obj exists and was not newly created
    ? shallowCloneObj(obj, key, state, opts)
    // obj dne or was newly created
    : obj

  // check if the current key is the last key
  if (state.i < state.keypath.length - 1) {
    // current key is not the last key
    return getOperation(clonedObj, key, state, opts)
  }

  // current key is the last key
  if (objExists) {
    // obj exists, delete the value
    if (exists(clonedObj[key])) {
      // finally delete the last key in the keypath
      delete clonedObj[key]
      // object was modified, return modified rootCtx
      return state.rootCtx
    } else {
      // object was NOT modified, return original rootCtx
      return state.originalRootCtx
    }
  } else if (opts.force) {
    // object was NOT modified, return original rootCtx
    return state.originalRootCtx
  }

  throw new TypeError(undefinedErrMessage(key, state))
}

function shallowCloneObj (_obj, key, state, opts, log) {
  var obj = opts.shallowClone(_obj)

  if (state.ctx === state.rootCtx) {
    // root object
    state.originalRootCtx = state.rootCtx
    state.rootCtx = state.ctx = obj
  } else {
    // not root object
    var objKey = last(state.keypathSplit)
    debug(state.keypathSplit)
    state.parentCtx[objKey] = state.ctx = obj
  }

  return obj
}
