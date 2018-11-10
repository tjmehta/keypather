var assert = require('assert')
var debug = require('debug')('keypather:operations:set')
var exists = require('101/exists')
var last = require('101/last')

var normalizedKeypath = require('../normalized-keypath')

module.exports = function createOperation (obj, key, state, opts) {
  // if no parentCtx, obj should be root
  if (!state.parentCtx) return obj
  var objKey = last(state.keypathSplit)
  // this shouldn't happen: if parentCtx exists, objKey will exist
  assert(exists(objKey), 'invalid state.keypathSplit')

  // normalize keypath
  var objKeypath = normalizedKeypath(state.keypathSplit)
  var isArrayKey = typeof key === 'number'

  if (!exists(obj)) {
    // obj does not exist
    // create object
    obj = isArrayKey ? [] : {}
    state.parentCtx[objKey] = state.ctx = obj
    // mark object as created
    state.createOperation.createdKeypaths[objKeypath] = true
  } else {
    // obj exists
    debug('arrayCheck %O %O %O', obj, objKey, objKeypath)
    var objWasCreated = state.createOperation.createdKeypaths[objKeypath]
    if (objWasCreated && !Array.isArray(obj) && isArrayKey) {
      // if obj was created, is object, and found array key: convert object to array
      obj = Object.keys(obj).reduce(function (arr, key) {
        arr[key] = obj[key]
        return arr
      }, [])
      state.parentCtx[objKey] = state.ctx = obj
    }
  }

  debug('createOperation %O %O %O', { obj: obj, key: key }, opts, state)
  return obj
}
