module.exports = function stateToAtKeypath (state) {
  var offset = state.insideBracketString ? 2 : 1
  offset = Math.max(offset, 0)
  var keyEnd = state.keyStart - offset
  keyEnd = Math.max(keyEnd, 0)
  return state.keypath.slice(0, keyEnd)
}
