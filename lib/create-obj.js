var debug = require('debug')('keypather:operations:set')
var exists = require('101/exists')
var last = require('101/last')

module.exports = function createObj (obj, key, state, opts) {
  /* istanbul ignore next */
  // this shouldn't happen: if obj exists, createOperation should not be called
  if (exists(obj)) throw new Error('createOperation should not be called if obj exists')
  var objKey = last(state.keypathSplit)
  /* istanbul ignore next */
  // this shouldn't happen: objKey will exist
  if (!exists(objKey)) throw new Error('invalid state.keypathSplit')

  // normalize keypath
  var objKeypath = state.normalizedKeypath()
  var isArrayKey = typeof key === 'number'
  // create object
  obj = isArrayKey ? [] : {}
  state.parentCtx[objKey] = state.ctx = obj
  // mark object as created, for expand
  state.createOperation.createdKeypaths[objKeypath] = true

  debug('createOperation %O %O %O', { obj: obj, key: key }, opts, state)
  return obj
}
