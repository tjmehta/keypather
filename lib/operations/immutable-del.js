var debug = require('debug')('keypather:operations:set')
var exists = require('101/exists')

var getOperation = require('./get.js')
var undefinedErrMessage = require('../error-messages/key-of-undefined')
var shallowCloneObj = require('../shallow-clone-obj')

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
    if (key in clonedObj) {
      // finally delete the last key in the keypath
      delete clonedObj[key]
      if (!(key in clonedObj)) {
        // object was modified, return modified rootCtx
        debug('del success, return modified')
        return state.rootCtx
      } else {
        // object was NOT modified, return original rootCtx
        debug('del failed, return original')
        return state.originalRootCtx
      }
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
