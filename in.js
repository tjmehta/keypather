var inOperation = require('./lib/operations/in.js')
var keypathReducer = require('./lib/keypath-reducer.js')

module.exports = keypathIn

function keypathIn (ctx, keypath, opts) {
  return keypathReducer({
    ctx: ctx,
    keypath: keypath
  }, inOperation, opts)
}
