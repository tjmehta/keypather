/* eslint-env jest */
var expand = require('../../expand')

describe('expand', function () {
  var obj
  describe('expand(obj)', function () {
    describe('simple', function () {
      beforeEach(function () {
        obj = {
          foo: Math.random()
        }
      })

      it('should get the value', function () {
        expect(expand(obj)).toEqual({
          foo: obj.foo
        })
      })
    })
    describe('nested', function () {
      beforeEach(function () {
        obj = {
          'foo.bar': Math.random()
        }
      })

      it('should get the value', function () {
        expect(expand(obj)).toEqual({
          foo: {
            bar: obj['foo.bar']
          }
        })
      })
    })
    describe('mixed', function () {
      beforeEach(function () {
        obj = {
          'foo.qux': 10,
          'bar[0]': 1,
          'bar[1].yolo[0]': 1,
          'yolo': {}
        }
      })

      it('should get the value', function () {
        expect(expand(obj)).toEqual({
          foo: {
            qux: 10
          },
          bar: [
            1,
            {
              yolo: [1]
            }
          ],
          'yolo': {}
        })
      })
    })
  })
  describe('expand(arr)', function () {
    describe('simple', function () {
      beforeEach(function () {
        obj = {
          '[0]': 'foo',
          '[1]': 'bar'
        }
      })

      it('should get the value', function () {
        expect(expand(obj)).toEqual([
          'foo',
          'bar'
        ])
      })
    })
    describe('mixed', function () {
      beforeEach(function () {
        obj = {
          '[0].foo.qux': 10,
          '[0].bar[0]': 1,
          '[0].bar[1].yolo': true,
          '[1]': 'hello'
        }
      })

      it('should get the value', function () {
        expect(expand(obj)).toEqual([
          {
            foo: {
              qux: 10
            },
            bar: [
              1,
              {
                yolo: true
              }
            ]
          },
          'hello'
        ])
      })
    })
    describe('delimeter', function () {
      beforeEach(function () {
        obj = {
          'foo_qux': 'hello'
        }
      })

      it('should expand the object', function (done) {
        expect(expand(obj, '_')).toEqual({
          foo: {
            qux: 'hello'
          }
        })
        done()
      })
    })
  })
})
