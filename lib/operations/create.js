var exists = require('101/exists')
var last = require('101/last')
var normalizedKeypath = require('../normalized-keypath')
var throwUndefinedErr = require('../throw-undefined-error')

module.exports = function createOperation (obj, key, state, opts) {
  if (!obj) throwUndefinedErr(key, state)
  if (!opts.create) return
  obj[key] = {}
  const keypath = normalizedKeypath(state.keypathSplit.concat(key))
  state.createOperation.createdKeypaths[keypath] = {
    allNumberValues: true
  }
}
