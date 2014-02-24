var valueForKeypath = require('../index');

describe('bracket notation', function () {
  describe("valueForKeyPath(obj, 'foo['bar']')", function () {
    before(function () {
      this.obj = {
        foo: {
          bar: Math.random()
        }
      };
    });
    it('should get the value', function () {
      valueForKeypath(this.obj, "foo['bar']").should.eql(this.obj.foo.bar);
    });
  });
  describe("valueForKeyPath(obj, 'foo['bar']['baz']')", function () {
    before(function () {
      this.obj = {
        foo: {
          bar: {
            baz: Math.random()
          }
        }
      };
    });
    it('should get the value', function () {
      valueForKeypath(this.obj, "foo['bar']['baz']").should.eql(this.obj.foo.bar.baz);
    });
  });
});