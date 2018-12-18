var defaults = require('101/defaults')

var defaultShallowClone = require('./lib/default-shallow-clone')
var keypathReducer = require('./lib/keypath-reducer.js')
var setOperation = require('./lib/operations/immutable-set.js')

module.exports = immutableSetKeypath

function immutableSetKeypath (ctx, keypath, val, opts) {
  opts = defaults(opts, {
    shallowClone: defaultShallowClone
  })
  return keypathReducer({
    ctx: ctx,
    keypath: keypath,
    val: val
  }, setOperation, opts)
}
