var defaults = require('101/defaults')

var defaultShallowClone = require('./lib/default-shallow-clone')
var keypathReducer = require('./lib/keypath-reducer.js')
var delOperation = require('./lib/operations/immutable-del.js')

module.exports = immutableDelKeypath

function immutableDelKeypath (ctx, keypath, opts) {
  opts = defaults(opts, {
    shallowClone: defaultShallowClone
  })
  return keypathReducer({
    ctx: ctx,
    keypath: keypath
  }, delOperation, opts)
}
