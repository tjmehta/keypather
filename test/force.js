var keypather = require('../index');

describe('force', function () {
  describe("keypather().set(obj, 'foo.bar', 'value')", forceGetSetGet("foo", 'value'));
  describe("keypather().set(obj, 'foo.bar', 'value')", forceGetSetGet("foo.bar", 'value'));
  describe("keypather().set(obj, 'foo.bar', 'value')", forceGetSetGet("['foo'].bar", 'value'));
  describe("keypather().set(obj, 'foo['bar']', 'value')", forceGetSetGet("foo['bar']", 'value'));
  describe("keypather().set(obj, 'foo['bar']', 'value')", forceGetSetGet("['foo']['bar']", 'value'));

  describe("keypather({ force: false }).set(obj, 'foo.bar', 'value')", errorGetSet("foo()", 'value'));
  describe("keypather({ force: false }).set(obj, 'foo.bar', 'value')", errorGetSet("foo.bar", 'value'));
  describe("keypather({ force: false }).set(obj, 'foo.bar', 'value')", errorGetSet("['foo'].bar", 'value'));
  describe("keypather({ force: false }).set(obj, 'foo['bar']', 'value')", errorGetSet("foo['bar']", 'value'));
  describe("keypather({ force: false }).set(obj, 'foo['bar']', 'value')", errorGetSet("['foo']['bar']", 'value'));

  it('should error for get keypath that does not exist after set with force:true', function () {
    this.keypather = keypather({ force: true });
    this.obj = {};
    this.keypather.set('foo.bar', 'value');
    (this.keypather.get(this.obj, 'foo.qux') === undefined).should.equal(true);
  });
});

function forceGetSetGet (keypath, value) {
  return function () {
    before(function () {
      this.obj = {};
      this.keypather = keypather({ force: true });
    });
    it('should set the value', function () {
      (this.keypather.get(this.obj, keypath) === undefined).should.equal(true);
      this.keypather.set(this.obj, keypath, value);
      this.keypather.get(this.obj, keypath).should.eql(value);
    });
  };
}
function errorGetSet (keypath, value) {
  return function () {
    before(function () {
      this.obj = {};
      this.keypather = keypather({ force: false });
    });
    it('should set the value', function () {
      var errs = [];
      try {
        this.keypather.get(this.obj, keypath);
      }
      catch (err) {
        errs.push(err);
      }
      try {
        this.keypather.set(this.obj, keypath, value);
      }
      catch (err) {
        errs.push(err);
      }
      errs.length.should.equal(2);
    });
  };
}
