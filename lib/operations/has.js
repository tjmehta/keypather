var exists = require('101/exists')

var getOperation = require('./get.js')
var isLastKey = require('../is-last-key')

module.exports = function hasOperation (obj, key, state, opts) {
  if (!isLastKey(state)) {
    return getOperation(obj, key, state, opts)
  }
  if (exists(obj)) {
    try {
      return obj.hasOwnProperty(key)
    } catch (err) {
      var atKeypath = state.keypath.slice(0, state.sectionStart)
      throw new Error([
        err.message,
        " (for '",
        key,
        "' in ",
        obj,
        " at keypath '",
        atKeypath,
        "')"
      ].join(''))
    }
  } else if (opts.force) {
    return false
  } else {
    // no obj, no force
    var atKeypath = state.keypath.slice(0, state.sectionStart)
    throw new TypeError([
      "Cannot use 'in' operator to search for '",
      key,
      "' in ",
      obj,
      " (at keypath '",
      atKeypath,
      "')"
    ].join(''))
  }
}
