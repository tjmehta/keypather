var keypather = require('../index')();

describe('bracket notation', function () {
  describe("keypather.get(obj, 'foo['bar']')", function () {
    before(function () {
      this.obj = {
        foo: {
          bar: Math.random()
        }
      };
    });
    it('should get the value', function () {
      keypather.get(this.obj, "foo['bar']").should.eql(this.obj.foo.bar);
    });
  });
  describe("keypather.get(obj, 'foo['bar']['baz']')", function () {
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
      keypather.get(this.obj, "foo['bar']['baz']").should.eql(this.obj.foo.bar.baz);
    });
  });
});