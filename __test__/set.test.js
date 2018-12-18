/* eslint-env jest */
var debug = require('debug')('keypather:set.test')
var set = require('../set')

var old = {}
var val = {}

function testFunction (fn, args, expected, only) {
  var testFn = only ? test.only : test
  if (expected instanceof Error || expected instanceof RegExp) {
    testFn('should error: ' + fn.name + '("' + args[1] + '")', function () {
      expect(function () {
        fn.apply(null, args)
      }).toThrow(expected)
    })
  } else {
    testFn('should ' + fn.name + '("' + args[1] + '")', function () {
      var result = fn.apply(null, args)
      var opts = args[3] || {}
      var expectedResult = opts.overwritePrimitives === false ? undefined : args[2]
      debug({
        result: result,
        expectedResult: expectedResult,
        object: args[0],
        expectedObject: expected
      })
      expect(val).toEqual({}) // safety check, since val is static
      expect(result).toBe(expectedResult)
      expect(args[0]).toEqual(expected)
      expect(Array.isArray(args[0])).toBe(Array.isArray(expected))
    })
  }
}

testFunction.only = function (fn, args, expected) {
  testFunction(fn, args, expected, true)
}

describe('set', function () {
  describe('path exists', function () {
    describe('dot notation', function () {
      testFunction(set, [{ foo: old, zfoo: 1 }, 'foo', val], { foo: val, zfoo: 1 })
      testFunction(set, [{ foo: { bar: old, zbar: 2 }, zfoo: 1 }, 'foo.bar', val], { foo: { bar: val, zbar: 2 }, zfoo: 1 })
      testFunction(set, [{ foo: { bar: { qux: old, zqux: 2 }, zbar: 2 }, zfoo: 1 }, 'foo.bar.qux', val], { foo: { bar: { qux: val, zqux: 2 }, zbar: 2 }, zfoo: 1 })
    })

    describe('bracket notation', function () {
      describe('single quote', function () {
        testFunction(set, [{ foo: old }, "['foo']", val], { foo: val })
        testFunction(set, [[], '[0]', val], [val])
        testFunction(set, [{}, '[0]', val], { '0': val })
        testFunction(set, [[], 'foo', val], Object.assign([], {foo: val}))
        testFunction(set, [{}, 'foo', val], { 'foo': val })
        testFunction(set, [{ foo: { bar: old } }, "['foo']['bar']", val], { foo: { bar: val } })
        testFunction(set, [{ foo: { bar: { qux: old } } }, "['foo']['bar']['qux']", val], { foo: { bar: { qux: val } } })
        testFunction(set, [{ foo: { 'dot.key': { qux: old } } }, "['foo']['dot.key']['qux']", val], { foo: { 'dot.key': { qux: val } } })
        testFunction(set, [{ foo: { '[bracket.key]': { qux: old } } }, "['foo']['[bracket.key]']['qux']", val], { foo: { '[bracket.key]': { qux: val } } })
        testFunction(set, [{ foo: { '\'quote.key\'': { qux: old } } }, "['foo'][''quote.key'']['qux']", val], { foo: { '\'quote.key\'': { qux: val } } })

        describe('escaped', function () {
          testFunction(set, [{ foo: old }, '[\'foo\']', val], { foo: val })
          testFunction(set, [{ foo: { bar: old } }, '[\'foo\'][\'bar\']', val], { foo: { bar: val } })
          testFunction(set, [{ foo: { bar: { qux: old } } }, '[\'foo\'][\'bar\'][\'qux\']', val], { foo: { bar: { qux: val } } })
          testFunction(set, [{ foo: { 'dot.key': { qux: old } } }, '[\'foo\'][\'dot.key\'][\'qux\']', val], { foo: { 'dot.key': { qux: val } } })
          testFunction(set, [{ foo: { '[bracket.key]': { qux: old } } }, '[\'foo\'][\'[bracket.key]\'][\'qux\']', val], { foo: { '[bracket.key]': { qux: val } } })
          testFunction(set, [{ foo: { '\'quote.key\'': { qux: old } } }, '[\'foo\'][\'\'quote.key\'\'][\'qux\']', val], { foo: { '\'quote.key\'': { qux: val } } })
        })
      })

      describe('double quote', function () {
        testFunction(set, [{ foo: old }, '["foo"]', val], { foo: val })
        testFunction(set, [{ foo: { bar: old } }, '["foo"]["bar"]', val], { foo: { bar: val } })
        testFunction(set, [{ foo: { bar: { qux: old } } }, '["foo"]["bar"]["qux"]', val], { foo: { bar: { qux: val } } })
        testFunction(set, [{ foo: { 'dot.key': { qux: old } } }, '["foo"]["dot.key"]["qux"]', val], { foo: { 'dot.key': { qux: val } } })
        testFunction(set, [{ foo: { '[bracket.key]': { qux: old } } }, '["foo"]["[bracket.key]"]["qux"]', val], { foo: { '[bracket.key]': { qux: val } } })
        testFunction(set, [{ foo: { '"quote.key"': { qux: old } } }, '["foo"][""quote.key""]["qux"]', val], { foo: { '"quote.key"': { qux: val } } })

        describe('escaped', function () {
          // eslint-disable-next-line quotes
          testFunction(set, [{ foo: old }, "[\"foo\"]", val], { foo: val })
          // eslint-disable-next-line quotes
          testFunction(set, [{ foo: { bar: old } }, "[\"foo\"][\"bar\"]", val], { foo: { bar: val } })
          // eslint-disable-next-line quotes
          testFunction(set, [{ foo: { bar: { qux: old } } }, "[\"foo\"][\"bar\"][\"qux\"]", val], { foo: { bar: { qux: val } } })
          // eslint-disable-next-line quotes
          testFunction(set, [{ foo: { '[bracket.key]': { qux: old } } }, "[\"foo\"][\"[bracket.key]\"][\"qux\"]", val], { foo: { '[bracket.key]': { qux: val } } })
          // eslint-disable-next-line quotes
          testFunction(set, [{ foo: { '"quote.key"': { qux: old } } }, "[\"foo\"][\"\"quote.key\"\"][\"qux\"]", val], { foo: { '"quote.key"': { qux: val } } })
        })
      })
    })

    describe('overwrite', () => {
      testFunction(set, [{ foo: 1 }, 'foo.bar', val], { foo: { bar: val } })
      testFunction(set, [{ foo: 1 }, 'foo.qux', val, {overwritePrimitives: false}], { foo: 1 })
      testFunction(set, [{ foo: 1 }, 'foo[0]', val], { foo: [val] })
      testFunction(set, [{ foo: 1 }, 'foo[0]', val, {overwritePrimitives: false}], { foo: 1 })
      testFunction(set, [{ foo: 'str' }, 'foo.bar', val, {overwritePrimitives: false}], { foo: 'str' })
    })

    describe('silent', () => {
      var opts1 = {silent: true}
      var opts2 = {overwritePrimitives: false, silent: true}
      testFunction(set, [{ foo: [] }, 'foo.qux', val, opts1], { foo: Object.assign([], { qux: val }) })
      testFunction(set, [{ foo: {} }, 'foo[0]', val, opts1], { foo: {'0': val} })
      testFunction(set, [{ foo: 1 }, 'foo.qux', val, opts2], { foo: 1 })
      testFunction(set, [{ foo: 1 }, 'foo[0]', val, opts2], { foo: 1 })
    })
  })

  describe('path does not exist', function () {
    describe('force: true (default)', function () {
      describe('dot notation', function () {
        testFunction(set, [{}, 'foo', val], { foo: val })
        testFunction(set, [{}, 'foo.bar', val], { foo: { bar: val } })
        testFunction(set, [{ foo: {} }, 'foo.bar.qux', val], { foo: { bar: { qux: val } } })
        testFunction(set, [{}, 'foo[0]', val], { foo: [val] })
        testFunction(set, [{foo: {}}, 'foo[0]', val], { foo: { '0': val } })
      })

      describe('bracket notation', function () {
        testFunction(set, [{}, '["foo"]', val], { foo: val })
        testFunction(set, [{}, '["foo"]["bar"]', val], { foo: { bar: val } })
        testFunction(set, [{ foo: {} }, '["foo"]["bar"]["qux"]', val], { foo: { bar: { qux: val } } })
        testFunction(set, [{}, '["[""]"]', val], { '[""]': val }) // complex edgecase!
      })
    })

    describe('force: false', function () {
      describe('dot notation', function () {
        testFunction(set, [{}, 'foo', val, { force: false }], { foo: val })
        testFunction(set, [{}, 'foo.bar.qux', val, { force: false }], /'bar' of undefined.*at keypath 'foo' of 'foo.bar.qux'/)
        testFunction(set, [{ foo: {} }, 'foo.bar.qux', val, { force: false }], /'qux' of undefined.*at keypath 'foo.bar' of 'foo.bar.qux'/)
      })

      describe('bracket notation', function () {
        testFunction(set, [{}, '["foo"]', val, { force: false }], { foo: val })
        testFunction(set, [{}, '["foo"]["bar"]', val, { force: false }], /'bar' of undefined.*at keypath '\["foo"\]' of '\["foo"\]\["bar"\]'/)
        testFunction(set, [{ foo: {} }, '["foo"]["bar"]["qux"]', val, { force: false }], /'qux' of undefined.*at keypath '\["foo"\]\["bar"\]' of '\["foo"\]\["bar"\]\["qux"\]'/)
      })
    })
  })

  describe('errors', function () {
    describe('invalid dot notation', function () {
      testFunction(set, [{}, '.'], /0.*invalid dot key/)
      testFunction(set, [{}, '9'], /0.*invalid dot key/)
      testFunction(set, [{}, 'foo..bar'], /4.*invalid dot key/)
      testFunction(set, [{}, 'foo...bar'], /4.*invalid dot key/)
    })

    describe('invalid bracket notation', function () {
      testFunction(set, [{}, '['], /Unexpected end of keypath.*invalid bracket key/)
      testFunction(set, [{}, '[]'], /1.*invalid bracket key/)
      testFunction(set, [{}, '[""'], /Unexpected end of keypath.*invalid bracket string key/)
      testFunction(set, [{}, '[2'], /Unexpected end of keypath.*invalid bracket number key/)
    })
  })
})
