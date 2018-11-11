/* eslint-env jest */
var keypathHas = require('../has')

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

describe('keypathHas', function () {
  describe('path exists', function () {
    describe('dot notation', function () {
      testFunction(keypathHas, [{ foo: val }, 'foo'], true)
      testFunction(keypathHas, [{ foo: { bar: val } }, 'foo.bar'], true)
      testFunction(keypathHas, [{ foo: { bar: { qux: val } } }, 'foo.bar.qux'], true)
    })

    describe('bracket notation', function () {
      describe('single quote', function () {
        testFunction(keypathHas, [{ foo: val }, "['foo']"], true)
        testFunction(keypathHas, [{ foo: { bar: val } }, "['foo']['bar']"], true)
        testFunction(keypathHas, [{ foo: { bar: { qux: val } } }, "['foo']['bar']['qux']"], true)
        testFunction(keypathHas, [{ foo: { 'dot.key': { qux: val } } }, "['foo']['dot.key']['qux']"], true)
        testFunction(keypathHas, [{ foo: { '[bracket.key]': { qux: val } } }, "['foo']['[bracket.key]']['qux']"], true)
        testFunction(keypathHas, [{ foo: { '\'quote.key\'': { qux: val } } }, "['foo'][''quote.key'']['qux']"], true)
        testFunction(keypathHas, [{ '[""]': val }, '["[""]"]'], true) // complex edgecase!

        describe('escaped', function () {
          testFunction(keypathHas, [{ foo: val }, '[\'foo\']'], true)
          testFunction(keypathHas, [{ foo: { bar: val } }, '[\'foo\'][\'bar\']'], true)
          testFunction(keypathHas, [{ foo: { bar: { qux: val } } }, '[\'foo\'][\'bar\'][\'qux\']'], true)
          testFunction(keypathHas, [{ foo: { 'dot.key': { qux: val } } }, '[\'foo\'][\'dot.key\'][\'qux\']'], true)
          testFunction(keypathHas, [{ foo: { '[bracket.key]': { qux: val } } }, '[\'foo\'][\'[bracket.key]\'][\'qux\']'], true)
          testFunction(keypathHas, [{ foo: { '\'quote.key\'': { qux: val } } }, '[\'foo\'][\'\'quote.key\'\'][\'qux\']'], true)
        })
      })

      describe('double quote', function () {
        testFunction(keypathHas, [{ foo: val }, '["foo"]'], true)
        testFunction(keypathHas, [{ foo: { bar: val } }, '["foo"]["bar"]'], true)
        testFunction(keypathHas, [{ foo: { bar: { qux: val } } }, '["foo"]["bar"]["qux"]'], true)
        testFunction(keypathHas, [{ foo: { 'dot.key': { qux: val } } }, '["foo"]["dot.key"]["qux"]'], true)
        testFunction(keypathHas, [{ foo: { '[bracket.key]': { qux: val } } }, '["foo"]["[bracket.key]"]["qux"]'], true)
        testFunction(keypathHas, [{ foo: { '"quote.key"': { qux: val } } }, '["foo"][""quote.key""]["qux"]'], true)

        describe('escaped', function () {
          // eslint-disable-next-line quotes
          testFunction(keypathHas, [{ foo: val }, "[\"foo\"]"], true)
          // eslint-disable-next-line quotes
          testFunction(keypathHas, [{ foo: { bar: val } }, "[\"foo\"][\"bar\"]"], true)
          // eslint-disable-next-line quotes
          testFunction(keypathHas, [{ foo: { bar: { qux: val } } }, "[\"foo\"][\"bar\"][\"qux\"]"], true)
          // eslint-disable-next-line quotes
          testFunction(keypathHas, [{ foo: { '[bracket.key]': { qux: val } } }, "[\"foo\"][\"[bracket.key]\"][\"qux\"]"], true)
          // eslint-disable-next-line quotes
          testFunction(keypathHas, [{ foo: { '"quote.key"': { qux: val } } }, "[\"foo\"][\"\"quote.key\"\"][\"qux\"]"], true)
        })
      })
    })
  })

  describe('path does not exist', function () {
    describe('force: true (default)', function () {
      describe('dot notation', function () {
        testFunction(keypathHas, [{ }, 'foo'], false)
        testFunction(keypathHas, [{ }, 'foo.bar.qux'], false)
        testFunction(keypathHas, [{ foo: {} }, 'foo.bar.qux'], false)
        testFunction(keypathHas, [{ foo: { bar: Object.create({ qux: val }) } }, 'foo.bar.qux'], false)
        testFunction(keypathHas, [{ foo: { hasOwnProperty: function () { throw new Error('boom') } } }, 'foo.bar'], /hasOwnProperty\('bar'\) errored at keypath 'foo' of 'foo.bar'/)
        /* eslint-disable */
        testFunction(keypathHas, [{ foo: { hasOwnProperty: function () { throw null } } }, 'foo.bar'], /hasOwnProperty\('bar'\) errored at keypath 'foo' of 'foo.bar'/)
        testFunction(keypathHas, [{ foo: { hasOwnProperty: function () { throw { constructor: null } } } }, 'foo.bar'], /hasOwnProperty\('bar'\) errored at keypath 'foo' of 'foo.bar'/)
        /* eslint-enable */
      })

      describe('bracket notation', function () {
        testFunction(keypathHas, [{ }, '["foo"]'], false)
        testFunction(keypathHas, [{ }, '["foo"]["bar"]'], false)
        testFunction(keypathHas, [{ foo: {} }, '["foo"]["bar"]["qux"]'], false)
        testFunction(keypathHas, [{ foo: { bar: Object.create({ qux: val }) } }, '["foo"]["bar"]["qux"]'], false)
        testFunction(keypathHas, [{ }, '["[""]"]'], false) // complex edgecase!
      })
    })
    describe('force: false', function () {
      describe('dot notation', function () {
        testFunction(keypathHas, [{ }, 'foo', { force: false }], false)
        testFunction(keypathHas, [{ }, 'foo.bar.qux', { force: false }], /'bar' of undefined.*at keypath 'foo' of 'foo.bar/)
        testFunction(keypathHas, [{ foo: {} }, 'foo.bar.qux', { force: false }], /'hasOwnProperty' of undefined.*at keypath 'foo.bar' of 'foo.bar.qux/)
        testFunction(keypathHas, [{ foo: { bar: Object.create({ qux: val }) } }, 'foo.bar.qux', { force: false }], false)
      })

      describe('bracket notation', function () {
        testFunction(keypathHas, [{ }, '["foo"]', { force: false }], false)
        testFunction(keypathHas, [{ }, '["foo"]["bar"]', { force: false }], /'hasOwnProperty' of undefined.*at keypath '\["foo"\]' of '\["foo"\]\["bar"\]/)
        testFunction(keypathHas, [{ foo: {} }, '["foo"]["bar"]["qux"]', { force: false }], /'hasOwnProperty' of undefined.*at keypath '\["foo"\]\["bar"\]' of '\["foo"\]\["bar"\]\["qux"\]/)
        testFunction(keypathHas, [{ foo: { bar: Object.create({ qux: val }) } }, '["foo"]["bar"]["qux"]', { force: false }], false)
      })
    })
  })

  describe('errors', function () {
    describe('invalid dot notation', function () {
      testFunction(keypathHas, [{ }, '.'], /0.*invalid dot key/)
      testFunction(keypathHas, [{ }, '9'], /0.*invalid dot key/)
      testFunction(keypathHas, [{ }, 'foo..bar'], /4.*invalid dot key/)
      testFunction(keypathHas, [{ }, 'foo...bar'], /4.*invalid dot key/)
    })

    var noHasOwn = {}
    Object.defineProperty(noHasOwn, 'hasOwnProperty', {
      value: null
    })

    describe('invalid bracket notation', function () {
      testFunction(keypathHas, [{ }, '['], /Unexpected end of keypath.*invalid bracket key/)
      testFunction(keypathHas, [{ }, '[]'], /1.*invalid bracket key/)
      testFunction(keypathHas, [{ }, '[""'], /Unexpected end of keypath.*invalid bracket string key/)
      testFunction(keypathHas, [{ }, '[2'], /Unexpected end of keypath.*invalid bracket number key/)
      testFunction(keypathHas, [{ foo: { bar: noHasOwn } }, 'foo.bar.qux'], /hasOwnProperty.*qux.*foo\.bar\.qux/)
    })
  })
})
