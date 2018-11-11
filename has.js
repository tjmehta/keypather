var hasOperation = require('./lib/operations/has.js')
var keypathReducer = require('./lib/keypath-reducer.js')

module.exports = keypathHas

function keypathHas (ctx, keypath, opts) {
  return keypathReducer({
    ctx: ctx,
    keypath: keypath
  }, hasOperation, opts)
}
