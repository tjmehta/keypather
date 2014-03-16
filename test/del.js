var keypather = require('../index')();

describe('del', function () {
  describe("valueForKeyPath.del(obj, 'foo.bar', 'value')", del("foo.bar", 'value'));
  describe("valueForKeyPath.del(obj, 'foo.bar', 'value')", del("['foo'].bar", 'value'));
  describe("valueForKeyPath.del(obj, 'foo['bar']', 'value')", del("foo['bar']", 'value'));
  describe("valueForKeyPath.del(obj, 'foo['bar']', 'value')", del("['foo']['bar']", 'value'));
});

function del (keypath, value) {
  return function () {
    before(function () {
      this.obj = {
        foo: {
          bar: 'orig-value',
          qux: 1
        }
      };
    });
    it('should del the value', function () {
      keypather.del(this.obj, keypath).should.equal(true);
      this.obj.should.eql({
        foo: {
          qux: 1
        }
      });
    });
  };
}