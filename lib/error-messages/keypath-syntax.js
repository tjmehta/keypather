var exists = require('101/exists')

module.exports = function keypathSyntaxErrorMessage (state, extra, i) {
  var character = exists(i) ? state.keypath.charAt(i) : state.character
  if (character === 'END') {
    return "Unexpected end of keypath '$keypath' ($extra)"
      .replace(/\$extra/g, extra)
      .replace(/\$keypath/g, state.keypath)
  }
  return "Unexpected token '$character' in keypath '$keypath' at position $i ($extra)"
    .replace(/\$extra/g, extra)
    .replace(/\$character/g, character)
    .replace(/\$i/g, exists(i) ? i : state.i)
    .replace(/\$keypath/g, state.keypath)
}
