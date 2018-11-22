var debug = require('debug')('keypather:operations:set')
var exists = require('101/exists')

var typeConversionCheck = require('../type-conversion-check')
var isLastKey = require('../is-last-key')
var shallowCloneObj = require('../shallow-clone-obj')
var undefinedErrMessage = require('../error-messages/key-of-undefined')

module.exports = function immutableSetOperation (obj, key, state, opts) {
  debug('immutableSetOperation %O %O %O', { obj: obj, key: key }, opts, state)

  if (exists(obj)) {
    // check if the key can be set on the obj
    obj = typeConversionCheck(obj, key, state, opts)

    // if obj exists, clone it (bc it will be modified)
    var objKeypath = state.normalizedKeypath()
    var clonedObj = state.createOperation.createdKeypaths[objKeypath]
      ? obj // obj was newly created, no need to clone
      : shallowCloneObj(obj, key, state, opts)

    if (isLastKey(state)) {
      debug('SET %O %O %O', obj, key, state.keypath, state.val, state.createOperation.createdKeypaths)
      // finally, set the value
      if (clonedObj[key] !== state.val) {
        clonedObj[key] = state.val
        // object was modified, return modified rootCtx
        if (clonedObj[key] === state.val) {
          debug('set success, return modified')
          return state.rootCtx
        } else {
          // object was NOT modified, return original rootCtx
          debug('set failed, return original')
          return state.originalRootCtx
        }
      } else {
        // object was NOT modified, return original rootCtx
        debug('return original')
        return state.originalRootCtx
      }
    } else if (!exists(clonedObj[key]) && opts.force) {
      debug('TMP CREATE %O %O %O', obj, key, {}, state.keypath)
      var keypath = state.normalizedKeypath(state.keypathSplit.concat(key))
      state.createOperation.createdKeypaths[keypath] = true
      clonedObj[key] = {}
    }

    return clonedObj[key]
  }

  throw new TypeError(undefinedErrMessage(key, state))
}
