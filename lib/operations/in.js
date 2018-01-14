const exists = require('101/exists')

const getOperation = require('./get.js')
var isLastKey = require('../is-last-key')

module.exports = function inOperation (obj, key, state, opts) {
  if (!isLastKey(state)) {
    return getOperation(obj, key, state, opts)
  }
  if (exists(obj)) {
    return key in obj
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
