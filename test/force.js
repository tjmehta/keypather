var createValueForKeypath = require('../index');

describe('description', function () {
  describe("valueForKeyPath.set(obj, 'foo.bar', 'value')", forceGetSetGet("foo", 'value'));
  describe("valueForKeyPath.set(obj, 'foo.bar', 'value')", forceGetSetGet("foo.bar", 'value'));
  describe("valueForKeyPath.set(obj, 'foo.bar', 'value')", forceGetSetGet("['foo'].bar", 'value'));
  describe("valueForKeyPath.set(obj, 'foo['bar']', 'value')", forceGetSetGet("foo['bar']", 'value'));
  describe("valueForKeyPath.set(obj, 'foo['bar']', 'value')", forceGetSetGet("['foo']['bar']", 'value'));

  describe("valueForKeyPath.set(obj, 'foo.bar', 'value')", errorGetSet("foo()", 'value'));
  describe("valueForKeyPath.set(obj, 'foo.bar', 'value')", errorGetSet("foo.bar", 'value'));
  describe("valueForKeyPath.set(obj, 'foo.bar', 'value')", errorGetSet("['foo'].bar", 'value'));
  describe("valueForKeyPath.set(obj, 'foo['bar']', 'value')", errorGetSet("foo['bar']", 'value'));
  describe("valueForKeyPath.set(obj, 'foo['bar']', 'value')", errorGetSet("['foo']['bar']", 'value'));
});

function forceGetSetGet (keypath, value) {
  return function () {
    before(function () {
      this.obj = {};
      this.valueForKeypath = createValueForKeypath({ force: true });
    });
    it('should set the value', function () {
      exists(this.valueForKeypath.get(this.obj, keypath)).should.equal(false);
      this.valueForKeypath.set(this.obj, keypath, value);
      this.valueForKeypath.get(this.obj, keypath).should.eql(value);
    });
  };
}
function errorGetSet (keypath, value) {
  return function () {
    before(function () {
      this.obj = {
      };
      this.valueForKeypath = createValueForKeypath({ force: false });
    });
    it('should set the value', function () {
      var errs = [];
      try {
        this.valueForKeypath.get(this.obj, keypath);
      }
      catch (err) {
        errs.push(err);
      }
      try {
        this.valueForKeypath.set(this.obj, keypath, value);
      }
      catch (err) {
        errs.push(err);
      }
      errs.length.should.equal(2);
    });
  };
}

function exists (val) {
  return val !== null && val !== undefined;
}