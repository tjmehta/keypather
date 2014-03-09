var valueForKeypath = require('../index')();

describe('dot notation', function () {
  describe("valueForKeypath.get(obj, 'foo')", function () {
    before(function () {
      this.obj = {
        foo: Math.random()
      };
    });
    it('should get the value', function () {
      valueForKeypath.get(this.obj, 'foo').should.eql(this.obj.foo);
    });
  });
  describe("valueForKeypath.get(obj, 'foo.bar')", function () {
    before(function () {
      this.obj = {
        foo: {
          bar: Math.random()
        }
      };
    });
    it('should get the value', function () {
      valueForKeypath.get(this.obj, 'foo.bar').should.eql(this.obj.foo.bar);
    });
  });
});