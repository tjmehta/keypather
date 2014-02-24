var getValueForKeyPath = require('../index');

describe('functions', function () {
  describe("valueForKeyPath(obj, 'foo()')", function () {
    before(function () {
      this.obj = {
        foo: function () {
          return 'val';
        }
      };
    });
    it('should get the value', function () {
      getValueForKeyPath(this.obj, 'foo()').should.eql(this.obj.foo());
    });
  });
  describe("valueForKeyPath(obj, 'foo()()')", function () {
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
      getValueForKeyPath(this.obj, 'foo()()').should.eql(this.obj.foo()());
    });
  });
});