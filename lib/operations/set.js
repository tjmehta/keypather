var assert = require('assert')
var debug = require('debug')('keypather:operations:set')
var exists = require('101/exists')
var last = require('101/last')

var isLastKey = require('../is-last-key')
var normalizedKeypath = require('../normalized-keypath')

var getOperation = require('./get.js')

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
  var offset = state.insideBracketString ? 2 : 1
  offset = Math.max(offset, 0)
  var atKeypath = state.keypath.slice(0, state.keyStart - offset)
  throw new TypeError(
    "Cannot read property '" + key + "' of undefined (at keypath '" + atKeypath + "' of '" + state.keypath + "')"
  )
}

function createOperation (obj, key, state, opts) {
  // if no parentCtx, obj should be root
  if (!state.parentCtx) return obj
  var objKey = last(state.keypathSplit)
  // this shouldn't happen: if parentCtx exists, objKey will exist
  assert(exists(objKey), 'invalid state.keypathSplit')

  // normalize keypath
  var keypath
  var isArrayKey = typeof key === 'number'

  if (!exists(obj)) {
    // obj does not exist
    // create object
    obj = isArrayKey ? [] : {}
    state.parentCtx[objKey] = state.ctx = obj
    // mark object as created
    keypath = normalizedKeypath(state.keypathSplit)
    state.createOperation.createdKeypaths[keypath] = true
  } else {
    // obj exists
    keypath = normalizedKeypath(state.keypathSplit)
    debug('CONVERT %O %O %O', obj, objKey, keypath)
    var objWasCreated = state.createOperation.createdKeypaths[keypath]
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

