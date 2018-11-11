/* eslint-env jest */
var del = require('../del')

function testFunction (fn, args, expectedVal, only) {
  var testFn = only ? test.only : test
  if (expectedVal instanceof Error || expectedVal instanceof RegExp) {
    testFn('should error: ' + fn.name + '("' + args[1] + '")', function () {
      expect(function () {
        fn.apply(null, args)
      }).toThrow(expectedVal)
    })
  } else {
    testFn('should ' + fn.name + '("' + args[1] + '")', function () {
      expect(fn.apply(null, args)).toBe(expectedVal)
    })
  }
}

testFunction.only = function (fn, args, expectedVal) {
  testFunction(fn, args, expectedVal, true)
}

var val = {}

describe('del', function () {
  describe('path exists', function () {
    describe('dot notation', function () {
      testFunction(del, [{ foo: val }, 'foo'], true)
      testFunction(del, [{ foo: { bar: val } }, 'foo.bar'], true)
      testFunction(del, [{ foo: { bar: { qux: val } } }, 'foo.bar.qux'], true)
    })

    describe('bracket notation', function () {
      describe('single quote', function () {
        testFunction(del, [{ foo: val }, "['foo']"], true)
        testFunction(del, [{ foo: { bar: val } }, "['foo']['bar']"], true)
        testFunction(del, [{ foo: { bar: { qux: val } } }, "['foo']['bar']['qux']"], true)
        testFunction(del, [{ foo: { 'dot.key': { qux: val } } }, "['foo']['dot.key']['qux']"], true)
        testFunction(del, [{ foo: { '[bracket.key]': { qux: val } } }, "['foo']['[bracket.key]']['qux']"], true)
        testFunction(del, [{ foo: { '\'quote.key\'': { qux: val } } }, "['foo'][''quote.key'']['qux']"], true)
        testFunction(del, [{ '[""]': val }, '["[""]"]'], true) // complex edgecase!

        describe('escaped', function () {
          testFunction(del, [{ foo: val }, '[\'foo\']'], true)
          testFunction(del, [{ foo: { bar: val } }, '[\'foo\'][\'bar\']'], true)
          testFunction(del, [{ foo: { bar: { qux: val } } }, '[\'foo\'][\'bar\'][\'qux\']'], true)
          testFunction(del, [{ foo: { 'dot.key': { qux: val } } }, '[\'foo\'][\'dot.key\'][\'qux\']'], true)
          testFunction(del, [{ foo: { '[bracket.key]': { qux: val } } }, '[\'foo\'][\'[bracket.key]\'][\'qux\']'], true)
          testFunction(del, [{ foo: { '\'quote.key\'': { qux: val } } }, '[\'foo\'][\'\'quote.key\'\'][\'qux\']'], true)
        })
      })

      describe('double quote', function () {
        testFunction(del, [{ foo: val }, '["foo"]'], true)
        testFunction(del, [{ foo: { bar: val } }, '["foo"]["bar"]'], true)
        testFunction(del, [{ foo: { bar: { qux: val } } }, '["foo"]["bar"]["qux"]'], true)
        testFunction(del, [{ foo: { 'dot.key': { qux: val } } }, '["foo"]["dot.key"]["qux"]'], true)
        testFunction(del, [{ foo: { '[bracket.key]': { qux: val } } }, '["foo"]["[bracket.key]"]["qux"]'], true)
        testFunction(del, [{ foo: { '"quote.key"': { qux: val } } }, '["foo"][""quote.key""]["qux"]'], true)

        describe('escaped', function () {
          // eslint-disable-next-line quotes
          testFunction(del, [{ foo: val }, "[\"foo\"]"], true)
          // eslint-disable-next-line quotes
          testFunction(del, [{ foo: { bar: val } }, "[\"foo\"][\"bar\"]"], true)
          // eslint-disable-next-line quotes
          testFunction(del, [{ foo: { bar: { qux: val } } }, "[\"foo\"][\"bar\"][\"qux\"]"], true)
          // eslint-disable-next-line quotes
          testFunction(del, [{ foo: { '[bracket.key]': { qux: val } } }, "[\"foo\"][\"[bracket.key]\"][\"qux\"]"], true)
          // eslint-disable-next-line quotes
          testFunction(del, [{ foo: { '"quote.key"': { qux: val } } }, "[\"foo\"][\"\"quote.key\"\"][\"qux\"]"], true)
        })
      })
    })
  })

  var hasUndeletableProp = {}
  Object.defineProperty(hasUndeletableProp, 'qux', {
    writable: false,
    value: val
  })

  describe('path does not exist', function () {
    describe('force: true (default)', function () {
      describe('dot notation', function () {
        testFunction(del, [{ }, 'foo'], true)
        testFunction(del, [{ }, 'foo.bar.qux'], true)
        testFunction(del, [{ foo: {} }, 'foo.bar.qux'], true)
        testFunction(del, [{ foo: { bar: hasUndeletableProp } }, 'foo.bar.qux'], false)
      })

      describe('bracket notation', function () {
        testFunction(del, [{ }, '["foo"]'], true)
        testFunction(del, [{ }, '["foo"]["bar"]'], true)
        testFunction(del, [{ foo: {} }, '["foo"]["bar"]["qux"]'], true)
        testFunction(del, [{ foo: { bar: hasUndeletableProp } }, 'foo.bar.qux'], false)
        testFunction(del, [{ }, '["[""]"]'], true) // complex edgecase!
      })
    })
    describe('force: false', function () {
      describe('dot notation', function () {
        testFunction(del, [{ }, 'foo', { force: false }], true)
        testFunction(del, [{ }, 'foo.bar.qux', { force: false }], /bar.*foo.bar.qux/)
        testFunction(del, [{ foo: {} }, 'foo.bar.qux', { force: false }], /qux.*foo.bar.qux/)
        testFunction(del, [{ foo: { bar: hasUndeletableProp } }, 'foo.bar.qux', { force: false }], false)
      })

      describe('bracket notation', function () {
        testFunction(del, [{ }, '["foo"]', { force: false }], true)
        testFunction(del, [{ }, '["foo"]["bar"]', { force: false }], /bar.*\["foo"\]\["bar"\]/)
        testFunction(del, [{ foo: {} }, '["foo"]["bar"]["qux"]', { force: false }], /qux.*\["foo"\]\["bar"\]\["qux"\]/)
        testFunction(del, [{ foo: { bar: hasUndeletableProp } }, '["foo"]["bar"]["qux"]', { force: false }], false)
      })
    })
  })

  describe('errors', function () {
    describe('invalid dot notation', function () {
      testFunction(del, [{ }, '.'], /invalid dot key/)
      testFunction(del, [{ }, '9'], /invalid dot key/)
      testFunction(del, [{ }, 'foo..bar'], /invalid dot key/)
      testFunction(del, [{ }, 'foo...bar'], /invalid dot key/)
    })

    describe('invalid bracket notation', function () {
      testFunction(del, [{ }, '['], /Unexpected end of keypath.*invalid bracket key/)
      testFunction(del, [{ }, '[]'], /Unexpected token.*in keypath.*at position 1.*invalid bracket key/)
      testFunction(del, [{ }, '[""'], /Unexpected end of keypath.*invalid bracket string key/)
      testFunction(del, [{ }, '[2'], /Unexpected end of keypath.*invalid bracket number key/)
    })
  })
})
