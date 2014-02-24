var valueForKeypath = require('../index');

describe('dot notation', function () {
  describe("valueForKeyPath(obj, 'foo')", function () {
    before(function () {
      this.obj = {
        foo: Math.random()
      };
    });
    it('should get the value', function () {
      valueForKeypath(this.obj, 'foo').should.eql(this.obj.foo);
    });
  });
  describe("valueForKeyPath(obj, 'foo.bar')", function () {
    before(function () {
      this.obj = {
        foo: {
          bar: Math.random()
        }
      };
    });
    it('should get the value', function () {
      valueForKeypath(this.obj, 'foo.bar').should.eql(this.obj.foo.bar);
    });
  });
});