var valueForKeypath = require('../index')();

describe('functions', function () {
  describe("valueForKeypath.get(obj, 'foo()')", function () {
    before(function () {
      this.obj = {
        foo: function () {
          return 'val';
        }
      };
    });
    it('should get the value', function () {
      valueForKeypath.get(this.obj, 'foo()').should.eql(this.obj.foo());
    });
  });
  describe("valueForKeypath.get(obj, 'foo()()')", function () {
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
      valueForKeypath.get(this.obj, 'foo()()').should.eql(this.obj.foo()());
    });
  });
});