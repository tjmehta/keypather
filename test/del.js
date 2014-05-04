var keypather = require('../index')();

describe('del', function () {
  describe("keypather.del(obj, 'foo.bar')", del("foo.bar"));
  describe("keypather.del(obj, 'foo.bar')", del("['foo'].bar"));
  describe("keypather.del(obj, 'foo['bar']')", del("foo['bar']"));
  describe("keypather.del(obj, 'foo['bar']')", del("['foo']['bar']"));
});

function del (keypath) {
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