/* eslint-env jest */
var debug = require('debug')('keypather:set.test')
var exists = require('101/exists')
var deepEqual = require('fast-deep-equal')
var deepFreeze = require('deep-freeze-strict')

var set = require('../set')
var immutableSet = require('../immutable-set')

var old = { old: 'old' }
var val = {}

function testFunction (fn, args, expectedResult, only) {
  var testFn = only ? test.only : test
  if (expectedResult instanceof Error || expectedResult instanceof RegExp) {
    testFn('should error: ' + fn.name + '("' + args[1] + '")', function () {
      expect(function () {
        fn.apply(null, args)
      }).toThrow(expectedResult)
    })
  } else {
    testFn('should ' + fn.name + '("' + args[1] + '")', function () {
      var objUnchanged = deepEqual(args[0], expectedResult)
      var result = fn.apply(null, args)
      if (!objUnchanged) set.apply(null, args)
      var object = args[0]
      debug({
        object: object,
        keypath: args[1],
        result: result,
        expectedResult: expectedResult,
        objUnchanged: objUnchanged
      })
      expect(val).toEqual({}) // safety check, since val is static
      // should not be the original object
      if (objUnchanged) {
        expect(result).toBe(object)
      } else {
        expect(result).not.toBe(object)
      }
      // should deep equal object modified w/ set
      expect(result).toEqual(expectedResult)
      expect(result).toEqual(object) // modified object
      expect(Array.isArray(result)).toBe(Array.isArray(object))
      expectNoSharedChildren(result, expectedResult, val)
    })
  }
}

testFunction.only = function (fn, args, expected) {
  testFunction(fn, args, expected, true)
}

describe('immutable-set', function () {
  describe('path exists', function () {
    describe('object unchanged', () => {
      testFunction(immutableSet, [deepFreeze({ foo: { bar: val }, zfoo: 1 }), 'foo.bar', val], { foo: { bar: val }, zfoo: 1 })
    })

    describe('dot notation', function () {
      testFunction(immutableSet, [{ foo: old, zfoo: 1 }, 'foo', val], { foo: val, zfoo: 1 })
      testFunction(immutableSet, [{ foo: { bar: old, zbar: 2 }, zfoo: 1 }, 'foo.bar', val], { foo: { bar: val, zbar: 2 }, zfoo: 1 })
      testFunction(immutableSet, [{ foo: { bar: { qux: old, zqux: 2 }, zbar: 2 }, zfoo: 1 }, 'foo.bar.qux', val], { foo: { bar: { qux: val, zqux: 2 }, zbar: 2 }, zfoo: 1 })
    })

    describe('bracket notation', function () {
      describe('single quote', function () {
        testFunction(immutableSet, [{ foo: old }, "['foo']", val], { foo: val })
        testFunction(immutableSet, [{ foo: old }, "['foo']", val], { foo: val })
        testFunction(immutableSet, [[], '[0]', val], [val])
        testFunction(immutableSet, [{}, '[0]', val], { '0': val })
        testFunction(immutableSet, [{ foo: { bar: old } }, "['foo']['bar']", val], { foo: { bar: val } })
        testFunction(immutableSet, [{ foo: { bar: { qux: old } } }, "['foo']['bar']['qux']", val], { foo: { bar: { qux: val } } })
        testFunction(immutableSet, [{ foo: { 'dot.key': { qux: old } } }, "['foo']['dot.key']['qux']", val], { foo: { 'dot.key': { qux: val } } })
        testFunction(immutableSet, [{ foo: { '[bracket.key]': { qux: old } } }, "['foo']['[bracket.key]']['qux']", val], { foo: { '[bracket.key]': { qux: val } } })
        testFunction(immutableSet, [{ foo: { '\'quote.key\'': { qux: old } } }, "['foo'][''quote.key'']['qux']", val], { foo: { '\'quote.key\'': { qux: val } } })

        describe('escaped', function () {
          testFunction(immutableSet, [{ foo: old }, '[\'foo\']', val], { foo: val })
          testFunction(immutableSet, [{ foo: { bar: old } }, '[\'foo\'][\'bar\']', val], { foo: { bar: val } })
          testFunction(immutableSet, [{ foo: { bar: { qux: old } } }, '[\'foo\'][\'bar\'][\'qux\']', val], { foo: { bar: { qux: val } } })
          testFunction(immutableSet, [{ foo: { 'dot.key': { qux: old } } }, '[\'foo\'][\'dot.key\'][\'qux\']', val], { foo: { 'dot.key': { qux: val } } })
          testFunction(immutableSet, [{ foo: { '[bracket.key]': { qux: old } } }, '[\'foo\'][\'[bracket.key]\'][\'qux\']', val], { foo: { '[bracket.key]': { qux: val } } })
          testFunction(immutableSet, [{ foo: { '\'quote.key\'': { qux: old } } }, '[\'foo\'][\'\'quote.key\'\'][\'qux\']', val], { foo: { '\'quote.key\'': { qux: val } } })
        })
      })

      describe('double quote', function () {
        testFunction(immutableSet, [{ foo: old }, '["foo"]', val], { foo: val })
        testFunction(immutableSet, [{ foo: { bar: old } }, '["foo"]["bar"]', val], { foo: { bar: val } })
        testFunction(immutableSet, [{ foo: { bar: { qux: old } } }, '["foo"]["bar"]["qux"]', val], { foo: { bar: { qux: val } } })
        testFunction(immutableSet, [{ foo: { 'dot.key': { qux: old } } }, '["foo"]["dot.key"]["qux"]', val], { foo: { 'dot.key': { qux: val } } })
        testFunction(immutableSet, [{ foo: { '[bracket.key]': { qux: old } } }, '["foo"]["[bracket.key]"]["qux"]', val], { foo: { '[bracket.key]': { qux: val } } })
        testFunction(immutableSet, [{ foo: { '"quote.key"': { qux: old } } }, '["foo"][""quote.key""]["qux"]', val], { foo: { '"quote.key"': { qux: val } } })

        describe('escaped', function () {
          // eslint-disable-next-line quotes
          testFunction(immutableSet, [{ foo: old }, "[\"foo\"]", val], { foo: val })
          // eslint-disable-next-line quotes
          testFunction(immutableSet, [{ foo: { bar: old } }, "[\"foo\"][\"bar\"]", val], { foo: { bar: val } })
          // eslint-disable-next-line quotes
          testFunction(immutableSet, [{ foo: { bar: { qux: old } } }, "[\"foo\"][\"bar\"][\"qux\"]", val], { foo: { bar: { qux: val } } })
          // eslint-disable-next-line quotes
          testFunction(immutableSet, [{ foo: { '[bracket.key]': { qux: old } } }, "[\"foo\"][\"[bracket.key]\"][\"qux\"]", val], { foo: { '[bracket.key]': { qux: val } } })
          // eslint-disable-next-line quotes
          testFunction(immutableSet, [{ foo: { '"quote.key"': { qux: old } } }, "[\"foo\"][\"\"quote.key\"\"][\"qux\"]", val], { foo: { '"quote.key"': { qux: val } } })
        })
      })
    })

    describe('overwrite', () => {
      testFunction(immutableSet, [{ foo: 1 }, 'foo.bar', val], { foo: { bar: val } })
    })

    describe('overwrite: false', () => {
      testFunction(immutableSet, [{ foo: 1, zfoo: 1 }, 'foo.bar', val, { overwritePrimitives: false }], { foo: 1, zfoo: 1 })
      testFunction(immutableSet, [{ foo: 1, zfoo: 1 }, 'foo[0]', val, { overwritePrimitives: false }], { foo: 1, zfoo: 1 })
    })
  })

  describe('path does not exist', function () {
    describe('force: true (default)', function () {
      describe('dot notation', function () {
        testFunction(immutableSet, [{}, 'foo', val], { foo: val })
        testFunction(immutableSet, [{}, 'foo.bar', val], { foo: { bar: val } })
        testFunction(immutableSet, [{ foo: { bar: {} } }, 'foo.bar.qux.duck', val], { foo: { bar: { qux: { duck: val } } } })
        testFunction(immutableSet, [{}, 'foo[0]', val], { foo: [val] })
      })

      describe('bracket notation', function () {
        testFunction(immutableSet, [{}, '["foo"]', val], { foo: val })
        testFunction(immutableSet, [{}, '["foo"]["bar"]', val], { foo: { bar: val } })
        testFunction(immutableSet, [{ foo: {} }, '["foo"]["bar"]["qux"]', val], { foo: { bar: { qux: val } } })
        testFunction(immutableSet, [{}, '["[""]"]', val], { '[""]': val }) // complex edgecase!
      })
    })

    describe('force: false', function () {
      describe('dot notation', function () {
        testFunction(immutableSet, [{}, 'foo', val, { force: false }], { foo: val })
        testFunction(immutableSet, [{}, 'foo.bar.qux', val, { force: false }], /'bar' of undefined.*at keypath 'foo' of 'foo.bar.qux'/)
        testFunction(immutableSet, [{ foo: {} }, 'foo.bar.qux', val, { force: false }], /'qux' of undefined.*at keypath 'foo.bar' of 'foo.bar.qux'/)
      })

      describe('bracket notation', function () {
        testFunction(immutableSet, [{}, '["foo"]', val, { force: false }], { foo: val })
        testFunction(immutableSet, [{}, '["foo"]["bar"]', val, { force: false }], /'bar' of undefined.*at keypath '\["foo"\]' of '\["foo"\]\["bar"\]'/)
        testFunction(immutableSet, [{ foo: {} }, '["foo"]["bar"]["qux"]', val, { force: false }], /'qux' of undefined.*at keypath '\["foo"\]\["bar"\]' of '\["foo"\]\["bar"\]\["qux"\]'/)
      })
    })
  })

  describe('errors', function () {
    describe('invalid dot notation', function () {
      testFunction(immutableSet, [{}, '.'], /0.*invalid dot key/)
      testFunction(immutableSet, [{}, '9'], /0.*invalid dot key/)
      testFunction(immutableSet, [{}, 'foo..bar'], /4.*invalid dot key/)
      testFunction(immutableSet, [{}, 'foo...bar'], /4.*invalid dot key/)
    })

    describe('invalid bracket notation', function () {
      testFunction(immutableSet, [{}, '['], /Unexpected end of keypath.*invalid bracket key/)
      testFunction(immutableSet, [{}, '[]'], /1.*invalid bracket key/)
      testFunction(immutableSet, [{}, '[""'], /Unexpected end of keypath.*invalid bracket string key/)
      testFunction(immutableSet, [{}, '[2'], /Unexpected end of keypath.*invalid bracket number key/)
    })
  })
})

function expectNoSharedChildren (obj1, obj2, endVal) {
  var keys = dedupe(Object.keys(obj1).concat(obj2))
  keys.forEach(function (key) {
    var val1 = obj1[key]
    var val2 = obj2[key]
    if (!exists(val1) || val1 === endVal) return
    if (typeof val1 === 'object') {
      expect(val1).not.toBe(val2)
      expectNoSharedChildren(val1, val2, endVal)
    }
  })
}
function dedupe (keys) {
  return keys.filter(function (key1, i) {
    return keys.some(function (key2, j) {
      if (i === j) return true
      return key1 !== key2
    })
  })
}
