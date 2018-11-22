var last = require('101/last')

var isPrimitive = require('./is-primitive')
var defaultShallowClone = require('./default-shallow-clone')
var shallowCloneErrMessage = require('./error-messages/cannot-shallow-clone')

module.exports = function shallowCloneObj (_obj, key, state, opts, log) {
  var obj = opts.shallowClone(_obj)

  if (!isPrimitive(_obj) && obj === _obj) {
    throw new Error(shallowCloneErrMessage(_obj, state, opts.shallowClone === defaultShallowClone))
  }

  if (state.ctx === state.rootCtx) {
    // root object
    state.originalRootCtx = state.rootCtx
    state.rootCtx = state.ctx = obj
  } else {
    // not root object
    var objKey = last(state.keypathSplit)
    state.parentCtx[objKey] = state.ctx = obj
  }

  return obj
}
