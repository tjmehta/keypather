var valueForKeypath = require('../index');

describe('set and then get', function () {
  describe("valueForKeyPath(obj, 'foo.bar'), 'value'", set("foo", 'value'));
  describe("valueForKeyPath(obj, 'foo.bar'), 'value'", set("foo.bar", 'value'));
  describe("valueForKeyPath(obj, 'foo.bar'), 'value'", set("['foo'].bar", 'value'));
  describe("valueForKeyPath(obj, 'foo['bar']'), 'value'", set("foo['bar']", 'value'));
  describe("valueForKeyPath(obj, 'foo['bar']'), 'value'", set("['foo']['bar']", 'value'));
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
      valueForKeypath(this.obj, keypath, value);
      valueForKeypath(this.obj, keypath).should.eql(value);
    });
  };
}