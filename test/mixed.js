var keypather = require('../index')();

describe('mixed', function () {
  describe("keypather.get(obj, 'foo()['bar'].baz')", function () {
    before(function () {
      this.obj = {
        foo: function () {
          return {
            bar: {
              baz: 'val'
            }
          };
        }
      };
    });
    it('should get the value', function () {
      keypather.get(this.obj, "foo()['bar'].baz").should.eql(this.obj.foo().bar.baz);
    });
  });
  describe("keypather.get(obj, 'foo().bar['baz']')", function () {
    before(function () {
      this.obj = {
        foo: function () {
          return {
            bar: {
              baz: 'val'
            }
          };
        }
      };
    });
    it('should get the value', function () {
      keypather.get(this.obj, "foo().bar['baz']").should.eql(this.obj.foo().bar.baz);
    });
  });
  describe("keypather.get(obj, '['foo'].bar.baz()')", function () {
    before(function () {
      this.obj = {
        foo: {
          bar: {
            baz: function () {
              return 'val';
            }
          }
        }
      };
    });
    it('should get the value', function () {
      keypather.get(this.obj, "['foo'].bar.baz()").should.eql(this.obj.foo.bar.baz());
    });
  });
  describe("keypather.get(obj, '['foo'].bar().baz')", function () {
    before(function () {
      this.obj = {
        foo: {
          bar: function () {
            return {
              baz: 'val'
            };
          }
        }
      };
    });
    it('should get the value', function () {
      keypather.get(this.obj, "['foo'].bar().baz").should.eql(this.obj.foo.bar().baz);
    });
  });
  describe("keypather.get(obj, 'foo.bar()['baz']')", function () {
    before(function () {
      this.obj = {
        foo: {
          bar: function () {
            return {
              baz: 'val'
            };
          }
        }
      };
    });
    it('should get the value', function () {
      keypather.get(this.obj, "foo.bar()['baz']").should.eql(this.obj.foo.bar().baz);
    });
  });
  describe("keypather.get(obj, 'foo['bar'].baz()')", function () {
    before(function () {
      this.obj = {
        foo: {
          bar: {
            baz: function () {
              return 'val';
            }
          }
        }
      };
    });
    it('should get the value', function () {
      keypather.get(this.obj, "foo['bar'].baz()").should.eql(this.obj.foo.bar.baz());
    });
  });
});