/* eslint-env jest */
var get = require('../../get')

describe('mixed', function () {
  var obj
  describe("get(obj, 'foo['bar'].baz')", function () {
    beforeEach(function () {
      obj = {
        foo: {
          bar: {
            baz: 'val'
          }
        }
      }
    })

    it('should get the value', function () {
      expect(get(obj, "foo['bar'].baz")).toEqual(obj.foo.bar.baz)
    })
  })
  describe("get(obj, 'foo.bar['baz']')", function () {
    beforeEach(function () {
      obj = {
        foo: {
          bar: {
            baz: 'val'
          }
        }
      }
    })

    it('should get the value', function () {
      expect(get(obj, "foo.bar['baz']")).toEqual(obj.foo.bar.baz)
    })
  })
  describe("get(obj, '['foo'].bar.baz')", function () {
    beforeEach(function () {
      obj = {
        foo: {
          bar: {
            baz: 'val'
          }
        }
      }
    })

    it('should get the value', function () {
      expect(get(obj, "['foo'].bar.baz")).toEqual(obj.foo.bar.baz)
    })
  })
  describe("get(obj, '['foo'].bar.baz')", function () {
    beforeEach(function () {
      obj = {
        foo: {
          bar: {
            baz: 'val'
          }
        }
      }
    })

    it('should get the value', function () {
      expect(get(obj, "['foo'].bar.baz")).toEqual(obj.foo.bar.baz)
    })
  })
  describe("get(obj, 'foo.bar['baz']')", function () {
    beforeEach(function () {
      obj = {
        foo: {
          bar: 'val'
        }
      }
    })

    it('should get the value', function () {
      expect(get(obj, "foo.bar['baz']")).toEqual(obj.foo.bar.baz)
    })
  })
  describe("get(obj, 'foo['bar'].baz')", function () {
    beforeEach(function () {
      obj = {
        foo: {
          bar: {
            baz: 'val'
          }
        }
      }
    })

    it('should get the value', function () {
      expect(get(obj, "foo['bar'].baz")).toEqual(obj.foo.bar.baz)
    })
  })
  describe('most complicated get', function () {
    beforeEach(function () {
      obj = {
        NetworkSettings: {
          Ports: {
            '15000/tcp': [ {
              HostIp: '0.0.0.0',
              HostPort: '49166'
            } ]
          }
        }
      }
    })

    it('should get the value', function () {
      expect(get(obj, "NetworkSettings.Ports['15000/tcp'][0].HostPort")).toEqual(obj.NetworkSettings.Ports['15000/tcp'][0].HostPort)
    })
  })
})
