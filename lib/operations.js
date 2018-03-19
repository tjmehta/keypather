var exists = require('101/exists')

module.exports = {
  del: require('./operations/del'),
  get: require('./operations/get'),
  in: require('./operations/in'),
  set: require('./operations/set'),
  has: function (obj, key, state, opts) {
    if (state.i === state.keypath.length - 1) {
      if (exists(obj) && obj.hasOwnProperty) {
        return obj.hasOwnProperty(key)
      } else if (opts.force) {
        return false
      } else {
        // no obj, no force
        var atKeypath = state.keypath.slice(0, state.bracketStart)
        throw new TypeError(
          "Cannot read property '" + key + "' of undefined (at keypath '" + atKeypath + "')"
        )
      }
    } else {
      return this.get.apply(this, arguments)
    }
  }
}
