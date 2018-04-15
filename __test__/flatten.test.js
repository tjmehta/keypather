/* eslint-env jest */
var flatten = require('../flatten')
var testCases = require('./fixtures/flatten-expand-test-cases.js').common.concat(
  require('./fixtures/flatten-expand-test-cases.js').flatten
)

describe('flatten', function () {
  testCases.forEach(function (testCase) {
    var full = testCase.full
    var flat = testCase.flat
    var opts = testCase.opts

    test('flatten: ' + JSON.stringify(full), function () {
      expect(flatten(full, opts)).toEqual(flat)
    })
  })
})
