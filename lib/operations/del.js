const exists = require('101/exists')

const getOperation = require('./get.js')
const throwUndefinedErr = require('../throw-undefined-error')

module.exports = function delOperation (obj, key, state, opts) {
  if (state.i < state.keypath.length - 1) {
    return getOperation(obj, key, state, opts)
  }
  if (exists(obj)) {
    return delete obj[key]
  } else if (opts.force) {
    // no obj, force del returns true
    return true
  } else {
    // no obj, no force
    throwUndefinedErr(key, state)
  }
}
