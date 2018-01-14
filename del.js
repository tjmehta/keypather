const delOperation = require('./lib/operations/del.js')
const keypathReducer = require('./lib/keypath-reducer.js')

module.exports = del

function del (ctx, keypath, opts) {
  return keypathReducer({
    ctx: ctx,
    keypath: keypath
  }, delOperation, opts)
}
