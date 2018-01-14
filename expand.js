var debug = require('debug')('keypather:expand')
var exists = require('101/exists')
var defaults = require('101/defaults')

var keypathReducer = require('./lib/keypath-reducer.js')
var setOperation = require('./lib/operations/set.js')

module.exports = function keypatherExpand (obj, opts) {
  debug('expand %O %O', obj, opts)
  opts = exists(opts) ? opts : {}
  if (typeof opts === 'string') {
    opts = { delimeter: opts }
  }
  defaults(opts, {
    delimeter: '.'
  })
  var expanded = null
  var sharedState = {
    // hack: for root key, so that the root type created
    // the root key will be autocreated as array or object based on key values
    parentCtx: { $root: expanded },
    // share createOperation between "sets"
    createOperation: {
      createdKeypaths: {}
    }
  }
  return Object.keys(obj).reduce(function (expanded, keypath) {
    var val = obj[keypath]
    return expandKeypath(expanded, keypath, val, sharedState, opts)
  }, expanded)
}

function expandKeypath (ctx, keypath, val, sharedState, opts) {
  debug('expandKeypath %O', keypath)
  keypathReducer({
    ctx: ctx,
    keypath: keypath,
    val: val,
    keypathSplit: ['$root'],
    // shared state
    parentCtx: sharedState.parentCtx,
    createOperation: sharedState.createOperation
  }, function expandOperation (obj, key, state, opts) {
    return setOperation(obj, key, state, opts)
  }, opts)
  return sharedState.parentCtx.$root
}
