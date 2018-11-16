/* eslint-env jest */
var deepEqual = require('fast-deep-equal')

var immutableDel = require('../immutable-del')
var del = require('../del')

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
      var result = fn.apply(null, args)
      var obj = args[0]
      var objUnchanged = deepEqual(result, obj)
      if (!objUnchanged) del.apply(null, args)
      expect(result).toEqual(expectedResult)
      if (objUnchanged) expect(result).toBe(args[0])
      expect(Array.isArray(result)).toEqual(Array.isArray(expectedResult))
    })
  }
}

testFunction.only = function (fn, args, expectedVal) {
  testFunction(fn, args, expectedVal, true)
}

var val = {}
var hasUndeletableProp = {}
Object.defineProperty(hasUndeletableProp, 'qux', {
  enumerable: true,
  writable: false,
  value: val
})

describe('immutableDel', function () {
  describe('path exists', function () {
    describe('dot notation', function () {
      testFunction(immutableDel, [{ foo: val }, 'foo'], {})
      testFunction(immutableDel, [{ foo: { bar: val } }, 'foo.bar'], {foo: {}})
      testFunction(immutableDel, [{ foo: { bar: { qux: val } } }, 'foo.bar.qux'], {foo: {bar: {}}})
      testFunction(immutableDel, [{ foo: { baz: hasUndeletableProp } }, 'foo.baz.qux'], {foo: {baz: {}}})
    })

    describe('bracket notation', function () {
      describe('single quote', function () {
        testFunction(immutableDel, [{ foo: val }, "['foo']"], {})
        testFunction(immutableDel, [{ foo: { bar: val } }, "['foo']['bar']"], {foo: {}})
        testFunction(immutableDel, [{ foo: { bar: { qux: val } } }, "['foo']['bar']['qux']"], {foo: {bar: {}}})
        testFunction(immutableDel, [{ foo: { 'dot.key': { qux: val } } }, "['foo']['dot.key']['qux']"], { foo: { 'dot.key': {} } })
        testFunction(immutableDel, [{ foo: { '[bracket.key]': { qux: val } } }, "['foo']['[bracket.key]']['qux']"], { foo: { '[bracket.key]': {} } })
        testFunction(immutableDel, [{ foo: { '\'quote.key\'': { qux: val } } }, "['foo'][''quote.key'']['qux']"], { foo: { '\'quote.key\'': {} } })
        testFunction(immutableDel, [{ '[""]': val }, '["[""]"]'], {}) // complex edgecase!
        testFunction(immutableDel, [{ foo: { baz: hasUndeletableProp } }, '["foo"]["baz"]["qux"]'], { foo: { baz: {} } })

        describe('escaped', function () {
          testFunction(immutableDel, [{ foo: val }, '[\'foo\']'], {})
          testFunction(immutableDel, [{ foo: { bar: val } }, '[\'foo\'][\'bar\']'], { foo: {} })
          testFunction(immutableDel, [{ foo: { bar: { qux: val } } }, '[\'foo\'][\'bar\'][\'qux\']'], { foo: { bar: {} } })
          testFunction(immutableDel, [{ foo: { 'dot.key': { qux: val } } }, '[\'foo\'][\'dot.key\'][\'qux\']'], { foo: { 'dot.key': {} } })
          testFunction(immutableDel, [{ foo: { '[bracket.key]': { qux: val } } }, '[\'foo\'][\'[bracket.key]\'][\'qux\']'], { foo: { '[bracket.key]': {} } })
          testFunction(immutableDel, [{ foo: { '\'quote.key\'': { qux: val } } }, '[\'foo\'][\'\'quote.key\'\'][\'qux\']'], { foo: { '\'quote.key\'': {} } })
        })
      })

      describe('double quote', function () {
        testFunction(immutableDel, [{ foo: val }, '["foo"]'], {})
        testFunction(immutableDel, [{ foo: { bar: val } }, '["foo"]["bar"]'], { foo: {} })
        testFunction(immutableDel, [{ foo: { bar: { qux: val } } }, '["foo"]["bar"]["qux"]'], { foo: { bar: {} } })
        testFunction(immutableDel, [{ foo: { 'dot.key': { qux: val } } }, '["foo"]["dot.key"]["qux"]'], { foo: { 'dot.key': {} } })
        testFunction(immutableDel, [{ foo: { '[bracket.key]': { qux: val } } }, '["foo"]["[bracket.key]"]["qux"]'], { foo: { '[bracket.key]': {} } })
        testFunction(immutableDel, [{ foo: { '"quote.key"': { qux: val } } }, '["foo"][""quote.key""]["qux"]'], { foo: { '"quote.key"': {} } })

        describe('escaped', function () {
          // eslint-disable-next-line quotes
          testFunction(immutableDel, [{ foo: val }, "[\"foo\"]"], {})
          // eslint-disable-next-line quotes
          testFunction(immutableDel, [{ foo: { bar: val } }, "[\"foo\"][\"bar\"]"], { foo: {} })
          // eslint-disable-next-line quotes
          testFunction(immutableDel, [{ foo: { bar: { qux: val } } }, "[\"foo\"][\"bar\"][\"qux\"]"], { foo: { bar: {} } })
          // eslint-disable-next-line quotes
          testFunction(immutableDel, [{ foo: { '[bracket.key]': { qux: val } } }, "[\"foo\"][\"[bracket.key]\"][\"qux\"]"], { foo: { '[bracket.key]': {} } })
          // eslint-disable-next-line quotes
          testFunction(immutableDel, [{ foo: { '"quote.key"': { qux: val } } }, "[\"foo\"][\"\"quote.key\"\"][\"qux\"]"], { foo: { '"quote.key"': {} } })
        })
      })
    })
  })

  describe('path does not exist', function () {
    describe('force: true (default)', function () {
      describe('dot notation', function () {
        testFunction(immutableDel, [{ }, 'foo'], { })
        testFunction(immutableDel, [{ }, 'foo.bar.qux'], { })
        testFunction(immutableDel, [{ foo: {} }, 'foo.bar.qux'], { foo: {} })
      })

      describe('bracket notation', function () {
        testFunction(immutableDel, [{ }, '["foo"]'], { })
        testFunction(immutableDel, [{ }, '["foo"]["bar"]'], { })
        testFunction(immutableDel, [{ foo: {} }, '["foo"]["bar"]["qux"]'], { foo: {} })
        testFunction(immutableDel, [{ }, '["[""]"]'], { }) // complex edgecase!
      })
    })
    describe('force: false', function () {
      describe('dot notation', function () {
        testFunction(immutableDel, [{ }, 'foo', { force: false }], { })
        testFunction(immutableDel, [{ }, 'foo.bar.qux', { force: false }], /bar.*foo.bar.qux/)
        testFunction(immutableDel, [{ foo: {} }, 'foo.bar.qux', { force: false }], /qux.*foo.bar.qux/)
      })

      describe('bracket notation', function () {
        testFunction(immutableDel, [{ }, '["foo"]', { force: false }], { })
        testFunction(immutableDel, [{ }, '["foo"]["bar"]', { force: false }], /bar.*\["foo"\]\["bar"\]/)
        testFunction(immutableDel, [{ foo: {} }, '["foo"]["bar"]["qux"]', { force: false }], /qux.*\["foo"\]\["bar"\]\["qux"\]/)
      })
    })
  })

  describe('errors', function () {
    describe('invalid dot notation', function () {
      testFunction(immutableDel, [{ }, '.'], /invalid dot key/)
      testFunction(immutableDel, [{ }, '9'], /invalid dot key/)
      testFunction(immutableDel, [{ }, 'foo..bar'], /invalid dot key/)
      testFunction(immutableDel, [{ }, 'foo...bar'], /invalid dot key/)
    })

    describe('invalid bracket notation', function () {
      testFunction(immutableDel, [{ }, '['], /Unexpected end of keypath.*invalid bracket key/)
      testFunction(immutableDel, [{ }, '[]'], /Unexpected token.*in keypath.*at position 1.*invalid bracket key/)
      testFunction(immutableDel, [{ }, '[""'], /Unexpected end of keypath.*invalid bracket string key/)
      testFunction(immutableDel, [{ }, '[2'], /Unexpected end of keypath.*invalid bracket number key/)
    })
  })
})
