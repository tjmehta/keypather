var keypather = require('../index')();

describe('set and then get', function () {
  describe("valueForKeyPath.set(obj, 'foo.bar', 'value')", set("foo", 'value'));
  describe("valueForKeyPath.set(obj, 'foo.bar', 'value')", set("foo.bar", 'value'));
  describe("valueForKeyPath.set(obj, 'foo.bar', 'value')", set("['foo'].bar", 'value'));
  describe("valueForKeyPath.set(obj, 'foo['bar']', 'value')", set("foo['bar']", 'value'));
  describe("valueForKeyPath.set(obj, 'foo['bar']', 'value')", set("['foo']['bar']", 'value'));
});

function set (keypath, value) {
  return function () {
    before(function () {
      this.obj = {
        foo: {
          bar: 'orig-value'
        }
      };
    });
    it('should set the value', function () {
      keypather.set(this.obj, keypath, value);
      keypather.get(this.obj, keypath).should.eql(value);
    });
  };
}