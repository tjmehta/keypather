var debug = require('debug')('keypather:set.test')
var set = require('../set')

var old = {}
var val = {}

function testFunction (fn, args, expected, only) {
  const testFn = only ? test.only : test
  if (expected instanceof Error || expected instanceof RegExp) {
    testFn('should error: ' + fn.name + '("' + args[1] + '")', function () {
      expect(function () {
        fn.apply(null, args)
      }).toThrow(expected)
    })
  } else {
    testFn('should ' + fn.name + '("' + args[1] + '")', function () {
      var result = fn.apply(null, args)
      var expectedResult = args[2]
      debug({
        result: result,
        expectedResult: expectedResult,
        object: args[0],
        expectedObject: expected,
      })
      expect(val).toEqual({}) // safety check, since val is static
      expect(result).toBe(expectedResult)
      expect(args[0]).toEqual(expected)
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
        testFunction(set, [{ foo: { bar: old } }, "['foo']['bar']", val], { foo: { bar: val } })
        testFunction(set, [{ foo: { bar: { qux: old } } }, "['foo']['bar']['qux']", val], { foo: { bar: { qux: val } } })
        testFunction(set, [{ foo: { 'dot.key': { qux: old } } }, "['foo']['dot.key']['qux']", val], { foo: { 'dot.key': { qux: val } } })
        testFunction(set, [{ foo: { '[bracket.key]': { qux: old } } }, "['foo']['[bracket.key]']['qux']", val], { foo: { '[bracket.key]': { qux: val } } })
        testFunction(set, [{ foo: { '\'quote.key\'': { qux: old } } }, "['foo']['\'quote.key\'']['qux']", val], { foo: { '\'quote.key\'': { qux: val } } })

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
        testFunction(set, [{ foo: { '\"quote.key\"': { qux: old } } }, '["foo"]["\"quote.key\""]["qux"]', val], { foo: { '\"quote.key\"': { qux: val } } })

        describe('escaped', function () {
          testFunction(set, [{ foo: old }, "[\"foo\"]", val], { foo: val })
          testFunction(set, [{ foo: { bar: old } }, "[\"foo\"][\"bar\"]", val], { foo: { bar: val } })
          testFunction(set, [{ foo: { bar: { qux: old } } }, "[\"foo\"][\"bar\"][\"qux\"]", val], { foo: { bar: { qux: val } } })
          testFunction(set, [{ foo: { '[bracket.key]': { qux: old } } }, "[\"foo\"][\"[bracket.key]\"][\"qux\"]", val], { foo: { '[bracket.key]': { qux: val } } })
          testFunction(set, [{ foo: { '\"quote.key\"': { qux: old } } }, "[\"foo\"][\"\"quote.key\"\"][\"qux\"]", val], { foo: { '\"quote.key\"': { qux: val } } })
        })
      })
    })
  })

  describe('path does not exist', function () {
    describe('force: true (default)', function () {
      describe('dot notation', function () {
        testFunction(set, [{}, 'foo', val], { foo: val })
        testFunction(set, [{}, 'foo.bar', val], { foo: { bar: val } })
        testFunction(set, [{ foo: {} }, 'foo.bar.qux', val], { foo: { bar: { qux: val } } })
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
        testFunction(set, [{}, 'foo.bar.qux', val, { force: false }], /bar.*foo.*foo.bar.qux/)
        testFunction(set, [{ foo: {} }, 'foo.bar.qux', val, { force: false }], /qux.*bar.*foo.bar.qux/)
      })

      describe('bracket notation', function () {
        testFunction(set, [{}, '["foo"]', val, { force: false }], { foo: val })
        testFunction(set, [{}, '["foo"]["bar"]', val, { force: false }], /bar.*\["foo"\].*.*\["foo"\]\["bar"\]/)
        testFunction(set, [{ foo: {} }, '["foo"]["bar"]["qux"]', val, { force: false }], /qux.*\["bar"\].*\["foo"\]\["bar"\]\["qux"\]/)
      })
    })
  })

  describe('errors', function () {
    describe('invalid dot notation', function () {
      testFunction(set, [{}, '.'], /invalid dot key/)
      testFunction(set, [{}, '9'], /invalid dot key/)
      testFunction(set, [{}, 'foo..bar'], /invalid dot key/)
      testFunction(set, [{}, 'foo...bar'], /invalid dot key/)
    })

    describe('invalid bracket notation', function () {
      testFunction(set, [{}, '['], /char 2.*END.*invalid bracket key/)
      testFunction(set, [{}, '[]'], /char 2.*\].*invalid bracket key/)
      testFunction(set, [{}, '[""'], /char 4.*END.*invalid bracket string key/)
      testFunction(set, [{}, '[2'], /char 3.*END.*invalid bracket number key/)
    })
  })
})
