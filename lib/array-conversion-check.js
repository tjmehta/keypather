var last = require('101/last')

// this methods check if the current key is a number
// and if obj was "force" created as object. if it was,
// convert it to an array.
module.exports = function arrayConversionCheck (obj, key, state, opts) {
  // check for an array key (number) being set on an object
  var isArrayKey = typeof key === 'number'
  if (!isArrayKey) return obj

  // check if obj is already an array
  if (Array.isArray(obj)) return obj

  // note: commented out arrayConversionCheck is only used by expand
  //   therefore every path that exists was created
  // check if obj was created by force
  // var objKeypath = normalizedKeypath(state.keypathSplit)
  // var objWasCreated = state.createOperation.createdKeypaths[objKeypath]
  // if (!objWasCreated) return

  // convert the created object to an array
  obj = Object.keys(obj).reduce(function (arr, key) {
    arr[key] = obj[key]
    return arr
  }, [])
  var objKey = last(state.keypathSplit)
  state.parentCtx[objKey] = state.ctx = obj
  return obj
}
