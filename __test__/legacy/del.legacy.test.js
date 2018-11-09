/* eslint-env jest */
var del = require('../../del')

describe('legacy tests: del', function () {
  describe("del(obj, 'foo.bar')", delTest('foo.bar'))
  describe("del(obj, '['foo'].bar')", delTest("['foo'].bar"))
  describe("del(obj, 'foo['bar']')", delTest("foo['bar']"))
  describe("del(obj, '['foo']['bar']')", delTest("['foo']['bar']"))
  describe("del(obj, 'foo.no.no')", delTest('foo.no.no', true))
  describe("del(obj, '['foo'].no.no')", delTest("['foo'].no.no", true))
  describe("del(obj, 'foo['no']['no']')", delTest("foo['no']['no']", true))
  describe("del(obj, '['foo']['no']['no']')", delTest("['foo']['no']['no']", true))
  describe("del(obj, 'foo.bar.boom')", delTest('foo.bar.boom', false, true))
})

function delTest (keypath, missing, nestedMissing) {
  var obj
  return function () {
    beforeEach(function () {
      obj = {
        foo: {
          bar: {
            boom: 'orig-value'
          },
          qux: 1
        }
      }
    })

    test('should del the value', function () {
      expect(del(obj, keypath)).toEqual(true)
      if (missing) {
        expect(obj).toEqual({
          foo: {
            bar: {
              boom: 'orig-value'
            },
            qux: 1
          }
        })
      } else if (nestedMissing) {
        expect(obj).toEqual({
          foo: {
            bar: {},
            qux: 1
          }
        })
      } else {
        expect(obj).toEqual({
          foo: {
            qux: 1
          }
        })
      }
    })
  }
}
