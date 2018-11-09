/* eslint-env jest */
var get = require('../../get')

describe('legacy tests: dot notation', function () {
  var obj
  describe("get(obj, 'foo')", function () {
    beforeEach(function () {
      obj = {
        foo: Math.random()
      }
    })

    it('should get the value', function () {
      expect(get(obj, 'foo')).toEqual(obj.foo)
    })
  })
  describe("get(obj, 'foo.bar')", function () {
    beforeEach(function () {
      obj = {
        foo: {
          bar: Math.random()
        }
      }
    })

    it('should get the value', function () {
      expect(get(obj, 'foo.bar')).toEqual(obj.foo.bar)
    })
  })
})
