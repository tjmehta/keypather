var debug = require('debug')('keypather:expand')
var defaults = require('101/defaults')
var exists = require('101/exists')
var isObject = require('101/is-object')

var keyRequiresBracketNotation = require('./lib/key-requires-bracket-notation')

module.exports = function flatten (obj, opts) {
  debug('flatten %O %O', obj, opts)
  opts = exists(opts) ? opts : {}
  if (typeof opts === 'string') {
    opts = { delimeter: opts }
  }
  defaults(opts, {
    delimeter: '.',
    dest: {}
  })

  var isArray = Array.isArray(obj)
  var keys = Object.keys(obj)

  return keys.reduce(function (flat, key) {
    var val = obj[key]

    // convert key to bracket key if necessary
    var isBracketKey = false
    if (isArray && /^[0-9]+$/.test(key)) {
      // obj is array, use bracket key
      isBracketKey = true
      key = '[' + key + ']'
    } else if (keyRequiresBracketNotation(key)) {
      // key starts with invalid char for dot key, use bracket key
      isBracketKey = true
      key = '["' + key + '"]'
    }

    // create keypath
    var keypath = exists(opts.parentKeypath)
      ? [ opts.parentKeypath, key ].join(isBracketKey ? '' : opts.delimeter)
      : key

    // check if value is flattenable
    if (Array.isArray(val) || isObject(val)) {
      // value is flattenable, continue flattenning
      flatten(val, {
        delimeter: opts.delimeter,
        parentKeypath: keypath,
        dest: flat
      })
    } else {
      // value is not flattenable, set flat key
      flat[keypath] = val
    }

    // return flattenned object
    return flat
  }, opts.dest)
}
