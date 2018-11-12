var defaults = require('101/defaults')

var keypathReducer = require('./lib/keypath-reducer.js')
var setOperation = require('./lib/operations/immutable-set.js')
var shallowClone = require('./lib/shallow-clone')

module.exports = immutableSetKeypath

function immutableSetKeypath (ctx, keypath, val, opts) {
  opts = defaults(opts, {
    shallowClone: shallowClone
  })
  return keypathReducer({
    ctx: ctx,
    keypath: keypath,
    val: val
  }, setOperation, opts)
}
