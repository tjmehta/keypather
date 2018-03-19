module.exports = function throwUndefinedErr (key, state) {
  var atKeypath = state.keypath.slice(0, state.sectionStart)
  throw new TypeError(
    "Cannot read property '" + key + "' of undefined (for keypath '" + atKeypath + "')"
  )
}