var keypather = require('../index')();

describe('functions', function () {
  describe("keypather.get(obj, 'foo()')", function () {
    before(function () {
      this.obj = {
        foo: function () {
          return 'val';
        }
      };
    });
    it('should get the value', function () {
      keypather.get(this.obj, 'foo()').should.eql(this.obj.foo());
    });
  });
  describe("keypather.get(obj, 'foo()()')", function () {
    before(function () {
      this.obj = {
        foo: function () {
          return function () {
            return 'val';
          };
        }
      };
    });
    it('should get the value', function () {
      keypather.get(this.obj, 'foo()()').should.eql(this.obj.foo()());
    });
  });
});