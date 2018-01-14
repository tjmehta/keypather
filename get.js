const getOperation = require('./lib/operations/get.js')
const keypathReducer = require('./lib/keypath-reducer.js')

module.exports = getKeypath

function getKeypath (ctx, keypath, opts) {
  return keypathReducer({
    ctx: ctx,
    keypath: keypath
  }, getOperation, opts)
}
