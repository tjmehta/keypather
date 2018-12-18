var shallowClone = require('shallow-clone')

module.exports = function defaultShallowClone (obj) {
  return shallowClone(typeof obj.toJSON === 'function' ? obj.toJSON() : obj)
}
