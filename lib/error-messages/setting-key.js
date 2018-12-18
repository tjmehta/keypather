var isObject = require('101/is-object')

var keyToString = require('../key-to-string')
var stateToAtKeypath = require('../state-to-at-keypath')

module.exports = function settingKey (obj, key, state) {
  var atKeypath = stateToAtKeypath(state)
  var type = typeString(obj)
  var keyDesc = typeof key === 'number'
    ? 'number key'
    : (type === 'array' ? 'string key' : 'key')
  var keyStr = typeof key === 'number'
    ? ('(' + keyToString(key) + ')')
    : keyToString(key)
  return "Setting $keyDesc $keyStr on $type at keypath '$atKeypath' of '$keypath')"
    .replace(/\$atKeypath/, atKeypath)
    .replace(/\$keypath/, state.keypath)
    .replace(/\$keyDesc/, keyDesc)
    .replace(/\$keyStr/, keyStr)
    .replace(/\$type/, type)
}

function typeString (obj) {
  if (isObject(obj)) return 'object'
  if (Array.isArray(obj)) return 'array'
  if (typeof obj === 'string') return "string '" + obj + "'"
  return (typeof obj) + ' ' + obj
}
