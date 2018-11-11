/* eslint-env jest */
var keypathIn = require('../in')

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

describe('keypathIn', function () {
  describe('path exists', function () {
    describe('dot notation', function () {
      testFunction(keypathIn, [{ foo: val }, 'foo'], true)
      testFunction(keypathIn, [{ foo: { bar: val } }, 'foo.bar'], true)
      testFunction(keypathIn, [{ foo: { bar: { qux: val } } }, 'foo.bar.qux'], true)
    })

    describe('bracket notation', function () {
      describe('single quote', function () {
        testFunction(keypathIn, [{ foo: val }, "['foo']"], true)
        testFunction(keypathIn, [{ foo: { bar: val } }, "['foo']['bar']"], true)
        testFunction(keypathIn, [{ foo: { bar: { qux: val } } }, "['foo']['bar']['qux']"], true)
        testFunction(keypathIn, [{ foo: { 'dot.key': { qux: val } } }, "['foo']['dot.key']['qux']"], true)
        testFunction(keypathIn, [{ foo: { '[bracket.key]': { qux: val } } }, "['foo']['[bracket.key]']['qux']"], true)
        testFunction(keypathIn, [{ foo: { '\'quote.key\'': { qux: val } } }, "['foo'][''quote.key'']['qux']"], true)
        testFunction(keypathIn, [{ '[""]': val }, '["[""]"]'], true) // complex edgecase!

        describe('escaped', function () {
          testFunction(keypathIn, [{ foo: val }, '[\'foo\']'], true)
          testFunction(keypathIn, [{ foo: { bar: val } }, '[\'foo\'][\'bar\']'], true)
          testFunction(keypathIn, [{ foo: { bar: { qux: val } } }, '[\'foo\'][\'bar\'][\'qux\']'], true)
          testFunction(keypathIn, [{ foo: { 'dot.key': { qux: val } } }, '[\'foo\'][\'dot.key\'][\'qux\']'], true)
          testFunction(keypathIn, [{ foo: { '[bracket.key]': { qux: val } } }, '[\'foo\'][\'[bracket.key]\'][\'qux\']'], true)
          testFunction(keypathIn, [{ foo: { '\'quote.key\'': { qux: val } } }, '[\'foo\'][\'\'quote.key\'\'][\'qux\']'], true)
        })
      })

      describe('double quote', function () {
        testFunction(keypathIn, [{ foo: val }, '["foo"]'], true)
        testFunction(keypathIn, [{ foo: { bar: val } }, '["foo"]["bar"]'], true)
        testFunction(keypathIn, [{ foo: { bar: { qux: val } } }, '["foo"]["bar"]["qux"]'], true)
        testFunction(keypathIn, [{ foo: { 'dot.key': { qux: val } } }, '["foo"]["dot.key"]["qux"]'], true)
        testFunction(keypathIn, [{ foo: { '[bracket.key]': { qux: val } } }, '["foo"]["[bracket.key]"]["qux"]'], true)
        testFunction(keypathIn, [{ foo: { '"quote.key"': { qux: val } } }, '["foo"][""quote.key""]["qux"]'], true)

        describe('escaped', function () {
          // eslint-disable-next-line quotes
          testFunction(keypathIn, [{ foo: val }, "[\"foo\"]"], true)
          // eslint-disable-next-line quotes
          testFunction(keypathIn, [{ foo: { bar: val } }, "[\"foo\"][\"bar\"]"], true)
          // eslint-disable-next-line quotes
          testFunction(keypathIn, [{ foo: { bar: { qux: val } } }, "[\"foo\"][\"bar\"][\"qux\"]"], true)
          // eslint-disable-next-line quotes
          testFunction(keypathIn, [{ foo: { '[bracket.key]': { qux: val } } }, "[\"foo\"][\"[bracket.key]\"][\"qux\"]"], true)
          // eslint-disable-next-line quotes
          testFunction(keypathIn, [{ foo: { '"quote.key"': { qux: val } } }, "[\"foo\"][\"\"quote.key\"\"][\"qux\"]"], true)
        })
      })
    })
  })

  describe('path does not exist', function () {
    describe('force: true (default)', function () {
      describe('dot notation', function () {
        testFunction(keypathIn, [{ }, 'foo'], false)
        testFunction(keypathIn, [{ }, 'foo.bar.qux'], false)
        testFunction(keypathIn, [{ foo: {} }, 'foo.bar.qux'], false)
        testFunction(keypathIn, [{ foo: { bar: Object.create({ qux: val }) } }, 'foo.bar.qux'], true)
      })

      describe('bracket notation', function () {
        testFunction(keypathIn, [{ }, '["foo"]'], false)
        testFunction(keypathIn, [{ }, '["foo"]["bar"]'], false)
        testFunction(keypathIn, [{ foo: {} }, '["foo"]["bar"]["qux"]'], false)
        testFunction(keypathIn, [{ foo: { bar: Object.create({ qux: val }) } }, 'foo.bar.qux'], true)
        testFunction(keypathIn, [{ }, '["[""]"]'], false) // complex edgecase!
      })
    })
    describe('force: false', function () {
      describe('dot notation', function () {
        testFunction(keypathIn, [{ }, 'foo', { force: false }], false)
        testFunction(keypathIn, [{ }, 'foo.bar.qux', { force: false }], /bar.*foo.bar.qux/)
        testFunction(keypathIn, [{ foo: {} }, 'foo.bar.qux', { force: false }], /qux.*foo.bar.qux/)
        testFunction(keypathIn, [{ foo: { bar: Object.create({ qux: val }) } }, 'foo.bar.qux', { force: false }], true)
      })

      describe('bracket notation', function () {
        testFunction(keypathIn, [{ }, '["foo"]', { force: false }], false)
        testFunction(keypathIn, [{ }, '["foo"]["bar"]', { force: false }], /bar.*\["foo"\]\["bar"\]/)
        testFunction(keypathIn, [{ foo: {} }, '["foo"]["bar"]["qux"]', { force: false }], /qux.*\["foo"\]\["bar"\]\["qux"\]/)
        testFunction(keypathIn, [{ foo: { bar: Object.create({ qux: val }) } }, '["foo"]["bar"]["qux"]', { force: false }], true)
      })
    })
  })

  describe('errors', function () {
    describe('invalid dot notation', function () {
      testFunction(keypathIn, [{ }, '.'], /0.*invalid dot key/)
      testFunction(keypathIn, [{ }, '9'], /0.*invalid dot key/)
      testFunction(keypathIn, [{ }, 'foo..bar'], /4.*invalid dot key/)
      testFunction(keypathIn, [{ }, 'foo...bar'], /4.*invalid dot key/)
    })

    describe('invalid bracket notation', function () {
      testFunction(keypathIn, [{ }, '['], /Unexpected end of keypath.*invalid bracket key/)
      testFunction(keypathIn, [{ }, '[]'], /1.*invalid bracket key/)
      testFunction(keypathIn, [{ }, '[""'], /Unexpected end of keypath.*invalid bracket string key/)
      testFunction(keypathIn, [{ }, '[2'], /Unexpected end of keypath.*invalid bracket number key/)
    })
  })
})
