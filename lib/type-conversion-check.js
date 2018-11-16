var isFunction = require('101/is-function')
var isObject = require('101/is-object')
var last = require('101/last')

var settingKey = require('./error-messages/setting-key')

/* istanbul ignore next */
var warn = (console.warn || console.log).bind(console)

// this methods check if the current key is a number
// and if obj was "force" created as object. if it was,
// convert it to an array.
module.exports = function arrayConversionCheck (obj, key, state, opts) {
  // obj existance is checked outside
  // check for an array key (number) being set on an object

  var isArrayKey = typeof key === 'number'

  if (isArrayKey) {
    // is array-key (number)
    if (Array.isArray(obj)) {
      // obj is array, return unmodified
      return obj
    }
    if (isObject(obj) || isFunction(obj)) {
      // obj is object or function
      var keypath = state.normalizedKeypath()
      if (state.createOperation.createdKeypaths[keypath]) {
        // obj was created as object, convert it to an array
        return convertToArray(obj, state)
      }
      // warn: setting number-key on object/function
      if (!opts.silent) warn(settingKey(obj, key, state))
      return obj
    }
    // obj is number, string or regexp
    if (opts.overwritePrimitives) {
      // overwrite w/ []
      return setObj(state, [])
    }
    // warn: setting array-key on primitive
    if (!opts.silent) warn(settingKey(obj, key, state))

    return obj
  } else {
    // object-key (string)
    if (isObject(obj)) {
      // obj is object, return unmodified
      return obj
    }
    if (Array.isArray(obj) || isFunction(obj)) {
      // obj is array or function
      // warn: setting string-key on array/function
      if (!opts.silent) warn(settingKey(obj, key, state))
      return obj
    }
    // obj is number, string or regexp. overwrite w/ {}
    if (opts.overwritePrimitives) {
      return setObj(state, {})
    }
    // warn: setting key on primitive
    if (!opts.silent) warn(settingKey(obj, key, state))

    return obj
  }
}

function convertToArray (val, state) {
  // convert the created object to an array
  val = Object.keys(val).reduce(function (arr, key) {
    arr[key] = val[key]
    return arr
  }, [])
  return setObj(state, val)
}

function setObj (state, val) {
  var objKey = last(state.keypathSplit)
  state.parentCtx[objKey] = state.ctx = val
  var keypath = state.normalizedKeypath()
  state.createOperation.createdKeypaths[keypath] = true
  return val
}
