var delOperation = require('./lib/operations/del.js')
var keypathReducer = require('./lib/keypath-reducer.js')

module.exports = del

function del (ctx, keypath, opts) {
  return keypathReducer({
    ctx: ctx,
    keypath: keypath
  }, delOperation, opts)
}
