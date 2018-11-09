/* eslint-env jest */
var get = require('../../get')

describe('legacy tests: bracket notation', function () {
  var obj
  describe("get(obj, 'foo['bar']')", function () {
    beforeEach(function () {
      obj = {
        foo: {
          bar: Math.random()
        }
      }
    })

    it('should get the value', function () {
      expect(get(obj, "foo['bar']")).toEqual(obj.foo.bar)
    })
  })
  describe("get(obj, 'foo['bar']['baz']')", function () {
    beforeEach(function () {
      obj = {
        foo: {
          bar: {
            baz: Math.random()
          }
        }
      }
    })

    it('should get the value', function () {
      expect(get(obj, "foo['bar']['baz']")).toEqual(obj.foo.bar.baz)
    })
  })
  describe("get(obj, '['foo.bar.baz']')", function () {
    beforeEach(function () {
      obj = { foo: { bar: { baz: 'foo.bar.bas' } } }
      obj['foo.bar.baz'] = Math.random()
    })

    it('should get the value', function () {
      expect(get(obj, "['foo.bar.baz']")).toEqual(obj['foo.bar.baz'])
    })
  })
  describe("get(obj, 'some['foo.bar.baz']')", function () {
    beforeEach(function () {
      obj = { foo: { bar: { baz: 'foo.bar.bas' } } }
      obj['foo.bar.baz'] = Math.random()
      obj.some = { 'foo.bar.baz': Math.random() }
    })

    it('should get the value', function () {
      expect(get(obj, "some['foo.bar.baz']")).toEqual(obj.some['foo.bar.baz'])
    })
  })
  describe("get(obj, '['foo.bar.baz'].some')", function () {
    beforeEach(function () {
      obj = { foo: { bar: { baz: 'foo.bar.bas' } } }
      obj['foo.bar.baz'] = {
        one: Math.random(),
        some: Math.random()
      }
      obj.some = { 'foo.bar.baz': Math.random() }
    })

    it('should get the value', function () {
      expect(get(obj, "['foo.bar.baz'].some")).toEqual(obj['foo.bar.baz'].some)
    })
  })
  describe("get(obj, '['foo.bar.baz']['his.hers']')", function () {
    beforeEach(function () {
      obj = { foo: { bar: { baz: 'foo.bar.bas' } } }
      obj['foo.bar.baz'] = {
        one: Math.random(),
        some: Math.random(),
        'his.hers': Math.random()
      }
      obj.some = { 'foo.bar.baz': Math.random() }
    })

    it('should get the value', function () {
      expect(get(obj, "['foo.bar.baz']['his.hers']")).toEqual(obj['foo.bar.baz']['his.hers'])
    })
  })
})

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
