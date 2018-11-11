/* eslint-env jest */
var get = require('../get')

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

describe('get', function () {
  describe('path exists', function () {
    describe('dot notation', function () {
      testFunction(get, [val, ''], val)
      testFunction(get, [{ foo: val }, 'foo'], val)
      testFunction(get, [{ foo: { bar: val } }, 'foo.bar'], val)
      testFunction(get, [{ foo: { bar: { qux: val } } }, 'foo.bar.qux'], val)
    })

    describe('bracket notation', function () {
      describe('no quote', function () {
        testFunction(get, [[val], '[0]'], val)
        testFunction(get, [[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, val], '[10]'], val)
        testFunction(get, [[[val]], '[0][0]'], val)
        testFunction(get, [[[[val]]], '[0][0][0]'], val)
      })
      describe('single quote', function () {
        testFunction(get, [[[val]], '[0][0]'], val)
        testFunction(get, [[[val]], '[0][0]'], val)
        testFunction(get, [{ foo: val }, "['foo']"], val)
        testFunction(get, [{ foo: { bar: val } }, "['foo']['bar']"], val)
        testFunction(get, [{ foo: { bar: { qux: val } } }, "['foo']['bar']['qux']"], val)
        testFunction(get, [{ foo: { 'dot.key': { qux: val } } }, "['foo']['dot.key']['qux']"], val)
        testFunction(get, [{ foo: { '[bracket.key]': { qux: val } } }, "['foo']['[bracket.key]']['qux']"], val)
        testFunction(get, [{ foo: { '\'quote.key\'': { qux: val } } }, "['foo'][''quote.key'']['qux']"], val)
        testFunction(get, [{ '[""]': val }, '["[""]"]'], val) // complex edgecase!

        describe('escaped', function () {
          testFunction(get, [{ foo: val }, '[\'foo\']'], val)
          testFunction(get, [{ foo: { bar: val } }, '[\'foo\'][\'bar\']'], val)
          testFunction(get, [{ foo: { bar: { qux: val } } }, '[\'foo\'][\'bar\'][\'qux\']'], val)
          testFunction(get, [{ foo: { 'dot.key': { qux: val } } }, '[\'foo\'][\'dot.key\'][\'qux\']'], val)
          testFunction(get, [{ foo: { '[bracket.key]': { qux: val } } }, '[\'foo\'][\'[bracket.key]\'][\'qux\']'], val)
          testFunction(get, [{ foo: { '\'quote.key\'': { qux: val } } }, '[\'foo\'][\'\'quote.key\'\'][\'qux\']'], val)
        })
      })

      describe('double quote', function () {
        testFunction(get, [{ foo: val }, '["foo"]'], val)
        testFunction(get, [{ foo: { bar: val } }, '["foo"]["bar"]'], val)
        testFunction(get, [{ foo: { bar: { qux: val } } }, '["foo"]["bar"]["qux"]'], val)
        testFunction(get, [{ foo: { 'dot.key': { qux: val } } }, '["foo"]["dot.key"]["qux"]'], val)
        testFunction(get, [{ foo: { '[bracket.key]': { qux: val } } }, '["foo"]["[bracket.key]"]["qux"]'], val)
        testFunction(get, [{ foo: { '"quote.key"': { qux: val } } }, '["foo"][""quote.key""]["qux"]'], val)

        describe('escaped', function () {
          // eslint-disable-next-line
          testFunction(get, [{ foo: val }, "[\"foo\"]"], val)
          // eslint-disable-next-line
          testFunction(get, [{ foo: { bar: val } }, "[\"foo\"][\"bar\"]"], val)
          // eslint-disable-next-line
          testFunction(get, [{ foo: { bar: { qux: val } } }, "[\"foo\"][\"bar\"][\"qux\"]"], val)
          // eslint-disable-next-line
          testFunction(get, [{ foo: { '[bracket.key]': { qux: val } } }, "[\"foo\"][\"[bracket.key]\"][\"qux\"]"], val)
          // eslint-disable-next-line
          testFunction(get, [{ foo: { '\"quote.key\"': { qux: val } } }, "[\"foo\"][\"\"quote.key\"\"][\"qux\"]"], val)
        })
      })

      describe('mixed notation', function () {
        testFunction(get, [{ foo: { bar: val } }, 'foo["bar"]'], val)
        testFunction(get, [{ foo: { bar: val } }, '["foo"].bar'], val) // important
      })
    })
  })

  describe('path does not exist', function () {
    describe('force: true (default)', function () {
      describe('dot notation', function () {
        testFunction(get, [{ }, 'foo'], undefined)
        testFunction(get, [{ }, 'foo.bar.qux'], undefined)
        testFunction(get, [{ foo: {} }, 'foo.bar.qux'], undefined)
      })

      describe('bracket notation', function () {
        testFunction(get, [{ }, '["foo"]'], undefined)
        testFunction(get, [{ }, '["foo"]["bar"]'], undefined)
        testFunction(get, [{ foo: {} }, '["foo"]["bar"]["qux"]'], undefined)
        testFunction(get, [{ }, '["[""]"]'], undefined) // complex edgecase!
      })
    })
    describe('force: false', function () {
      describe('dot notation', function () {
        testFunction(get, [{ }, 'foo', { force: false }], undefined)
        testFunction(get, [{ }, 'foo.bar.qux', { force: false }], /'bar' of undefined.*at keypath 'foo' of 'foo.bar.qux'/)
        testFunction(get, [{ foo: {} }, 'foo.bar.qux', { force: false }], /'qux' of undefined.*at keypath 'foo.bar' of 'foo.bar.qux'/)
      })

      describe('bracket notation', function () {
        testFunction(get, [{ }, '["foo"]', { force: false }], undefined)
        testFunction(get, [{ }, '["foo"]["bar"]', { force: false }], /'bar' of undefined.*at keypath '\["foo"\]' of '\["foo"\]\["bar"\]'/)
        testFunction(get, [{ foo: {} }, '["foo"]["bar"]["qux"]', { force: false }], /'qux' of undefined.*'\["foo"\]\["bar"\]' of '\["foo"\]\["bar"\]\["qux"\]'/)
      })
    })
  })

  describe('errors', function () {
    describe('invalid dot notation', function () {
      testFunction(get, [{ }, '.'], /0.*invalid dot key/)
      testFunction(get, [{ }, '9'], /0.*invalid dot key/)
      testFunction(get, [{ }, 'foo..bar'], /4.*invalid dot key/)
      testFunction(get, [{ }, 'foo...bar'], /4.*invalid dot key/)
    })

    describe('invalid bracket notation', function () {
      testFunction(get, [{ }, '['], /Unexpected end of keypath.*invalid bracket key/)
      testFunction(get, [{ }, '[]'], /Unexpected token.*in keypath.*at position 1.*invalid bracket key/)
      testFunction(get, [{ }, '["]'], /Unexpected token.*in keypath.*at position 2.*invalid bracket string key/)
      testFunction(get, [{ }, "[']"], /Unexpected token.*in keypath.*at position 2.*invalid bracket string key/)
      testFunction(get, [{ }, '[""'], /Unexpected end of keypath.*invalid bracket string key/)
      testFunction(get, [{ }, '["g]'], /Unexpected end of keypath.*invalid bracket string key/)
      testFunction(get, [{ }, '["g].yo'], /Unexpected end of keypath.*invalid bracket string key/)
      testFunction(get, [{ }, 'foo.'], /Unexpected end of keypath.*invalid dot key/)
      testFunction(get, [{ }, '[yo]'], /Unexpected token.*in keypath.*at position 1.*invalid bracket key/)
      testFunction(get, [{ }, '[0]foo'], /Unexpected token.*in keypath.*at position 3.*invalid bracket key/)
      testFunction(get, [{ }, 'foo.[0]'], /Unexpected token.*in keypath.*at position 4.*invalid dot key/)
      testFunction(get, [{ }, 'f-'], /Unexpected token.*in keypath.*at position 1.*invalid dot key/)
      testFunction(get, [{ }, '.bar'], /Unexpected token.*in keypath.*at position 0.*invalid dot key/)
      testFunction(get, [{ }, 'foo..bar'], /Unexpected token.*in keypath.*at position 4.*invalid dot key/)
      testFunction(get, [{ }, '["0"]foo'], /Unexpected end of keypath.*invalid bracket string key/) // edge case due to js lack of ability to read escapes
      testFunction(get, [{ }, '[2'], /Unexpected end of keypath.*invalid bracket number key/)
    })
  })
})
