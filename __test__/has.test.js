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
        testFunction(keypathHas, [{ foo: { '\'quote.key\'': { qux: val } } }, "['foo']['\'quote.key\'']['qux']"], true)
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
        testFunction(keypathHas, [{ foo: { '\"quote.key\"': { qux: val } } }, '["foo"]["\"quote.key\""]["qux"]'], true)

        describe('escaped', function () {
          testFunction(keypathHas, [{ foo: val }, "[\"foo\"]"], true)
          testFunction(keypathHas, [{ foo: { bar: val } }, "[\"foo\"][\"bar\"]"], true)
          testFunction(keypathHas, [{ foo: { bar: { qux: val } } }, "[\"foo\"][\"bar\"][\"qux\"]"], true)
          testFunction(keypathHas, [{ foo: { '[bracket.key]': { qux: val } } }, "[\"foo\"][\"[bracket.key]\"][\"qux\"]"], true)
          testFunction(keypathHas, [{ foo: { '\"quote.key\"': { qux: val } } }, "[\"foo\"][\"\"quote.key\"\"][\"qux\"]"], true)
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
        testFunction(keypathHas, [{ }, 'foo.bar.qux', { force: false }], /bar.*foo.bar.qux/)
        testFunction(keypathHas, [{ foo: {} }, 'foo.bar.qux', { force: false }], /qux.*foo.bar.qux/)
        testFunction(keypathHas, [{ foo: { bar: Object.create({ qux: val }) } }, 'foo.bar.qux', { force: false }], false)
      })

      describe('bracket notation', function () {
        testFunction(keypathHas, [{ }, '["foo"]', { force: false }], false)
        testFunction(keypathHas, [{ }, '["foo"]["bar"]', { force: false }], /bar.*\["foo"\]\["bar"\]/)
        testFunction(keypathHas, [{ foo: {} }, '["foo"]["bar"]["qux"]', { force: false }], /qux.*\["foo"\]\["bar"\]\["qux"\]/)
        testFunction(keypathHas, [{ foo: { bar: Object.create({ qux: val }) } }, '["foo"]["bar"]["qux"]', { force: false }], false)
      })
    })
  })

  describe('errors', function () {
    describe('invalid dot notation', function () {
      testFunction(keypathHas, [{ }, '.'], /invalid dot key/)
      testFunction(keypathHas, [{ }, '9'], /invalid dot key/)
      testFunction(keypathHas, [{ }, 'foo..bar'], /invalid dot key/)
      testFunction(keypathHas, [{ }, 'foo...bar'], /invalid dot key/)
    })

    var noHasOwn = {}
    Object.defineProperty(noHasOwn, 'hasOwnProperty', {
      value: null
    })

    describe('invalid bracket notation', function () {
      testFunction(keypathHas, [{ }, '['], /char 2.*END.*invalid bracket key/)
      testFunction(keypathHas, [{ }, '[]'], /char 2.*\].*invalid bracket key/)
      testFunction(keypathHas, [{ }, '[""'], /char 4.*END.*invalid bracket string key/)
      testFunction(keypathHas, [{ }, '[2'], /char 3.*END.*invalid bracket number key/)
      testFunction(keypathHas, [{ foo: { bar: noHasOwn } }, 'foo.bar.qux'], /hasOwnProperty.*qux.*foo\.bar\.qux/)
    })
  })
})
