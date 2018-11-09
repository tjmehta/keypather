/* eslint-env jest */
module.exports = function testFunction (fn, args, expectedVal) {
  if (expectedVal instanceof Error || expectedVal instanceof RegExp) {
    test('should error: ' + fn.name + '("' + args[1] + '")', function () {
      expect(function () {
        fn.apply(null, args)
      }).toThrow(expectedVal)
    })
  } else {
    test('should ' + fn.name + '("' + args[1] + '")', function () {
      expect(fn.apply(null, args)).toBe(expectedVal)
    })
  }
}
