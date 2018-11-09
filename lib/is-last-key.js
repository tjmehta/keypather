module.exports = function isLastKey (state) {
  return (state.i + 1) >= state.keypath.length
}
