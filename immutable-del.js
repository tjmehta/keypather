var defaults = require('101/defaults')

var keypathReducer = require('./lib/keypath-reducer.js')
var delOperation = require('./lib/operations/immutable-del.js')
var shallowClone = require('./lib/shallow-clone')

module.exports = immutableDelKeypath

function immutableDelKeypath (ctx, keypath, opts) {
  opts = defaults(opts, {
    shallowClone: shallowClone
  })
  return keypathReducer({
    ctx: ctx,
    keypath: keypath
  }, delOperation, opts)
}
