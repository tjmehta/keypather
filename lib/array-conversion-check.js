var last = require('101/last')

var normalizedKeypath = require('./normalized-keypath')
var settingArrKeyOnObj = require('./error-messages/setting-array-key-on-object')

/* istanbul ignore next */
var warn = (console.warn || console.log).bind(console)

// this methods check if the current key is a number
// and if obj was "force" created as object. if it was,
// convert it to an array.
module.exports = function arrayConversionCheck (obj, key, state, opts) {
  // check for an array key (number) being set on an object
  var isArrayKey = typeof key === 'number'
  if (!isArrayKey) return obj

  // check if obj is already an array
  if (Array.isArray(obj)) return obj

  if (!state.parentCtx) {
    // setting a number key on root object (that is an object, not array)
    warn(settingArrKeyOnObj(key, state))
    return obj
  } else {
    var keypath = normalizedKeypath(state.keypathSplit)
    if (!state.createOperation.createdKeypaths[keypath]) {
      // setting a number key on existant object (that is an object, not array)
      warn(settingArrKeyOnObj(key, state))
      return obj
    }
  }

  // convert the created object to an array
  obj = Object.keys(obj).reduce(function (arr, key) {
    arr[key] = obj[key]
    return arr
  }, [])
  var objKey = last(state.keypathSplit)
  state.parentCtx[objKey] = state.ctx = obj
  return obj
}
