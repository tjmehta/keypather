/* eslint-env jest */
var expand = require('../expand')
var testCases = require('./fixtures/flatten-expand-test-cases.js').common

describe('expand', function () {
  testCases.forEach(function (testCase) {
    var full = testCase.full
    var flat = testCase.flat
    var opts = testCase.opts
    var expandAssert = testCase.expandAssert

    test('expand: ' + JSON.stringify(flat), function () {
      var result = expand(flat, opts)
      expect(result).toEqual(full)
      if (expandAssert) expandAssert(testCase, result)
    })
  })
})
