var getOperation = require('./lib/operations/get.js')
var keypathReducer = require('./lib/keypath-reducer.js')

module.exports = getKeypath

function getKeypath (ctx, keypath, opts) {
  return keypathReducer({
    ctx: ctx,
    keypath: keypath
  }, getOperation, opts)
}
