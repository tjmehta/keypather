var keypathReducer = require('./lib/keypath-reducer.js')
var setOperation = require('./lib/operations/set.js')

module.exports = setKeypath

function setKeypath (ctx, keypath, val, opts) {
  return keypathReducer({
    ctx: ctx,
    keypath: keypath,
    val: val
  }, setOperation, opts)
}
