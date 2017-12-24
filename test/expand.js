var keypather = require('../index')();

describe('expand', function () {
  describe("keypather.expand(obj)", function () {
    describe('simple', function() {
      before(function () {
        this.obj = {
          foo: Math.random()
        };
      });
      it('should get the value', function () {
        keypather.expand(this.obj).should.eql({
          foo: this.obj.foo
        });
      });
    });
    describe('nested', function() {
      before(function () {
        this.obj = {
          'foo.bar': Math.random()
        };
      });
      it('should get the value', function () {
        keypather.expand(this.obj).should.eql({
          foo: {
            bar: this.obj['foo.bar']
          }
        });
      });
    });
    describe('mixed', function() {
      before(function () {
        this.obj = {
          'foo.qux': 10,
          'bar[0]': 1,
          'bar[1].yolo[0]': 1,
          'yolo': {}
        };
      });
      it('should get the value', function () {
        const expanded = keypather.expand(this.obj);

        expanded.bar.should.be.a.Array();
        expanded.should.be.exactly({
          foo: {
            qux: 10
          },
          bar: [
            1,
            {
              yolo: [1]
            }
          ],
          'yolo': {}
        });
      });
    });
  });
  describe("keypather.expand(arr)", function () {
    describe('simple', function() {
      before(function () {
        this.obj = {
          '[0]': 'foo',
          '[1]': 'bar'
        };
      });
      it('should get the value', function () {
        keypather.expand(this.obj).should.eql([
          'foo',
          'bar'
        ]);
      });
    });
    describe('in object', function() {
      before(function () {
        this.obj = {
          'values[0]': 'foo',
          'values[1]': 'bar'
        };
      });
      it('should get the value', function () {
        const expanded = keypather.expand(this.obj);

        expanded.values.should.be.a.Array();
        expanded.values.should.eql(['foo', 'bar']);
      });
    });
    describe('mixed', function() {
      before(function () {
        this.obj = {
          '[0].foo.qux': 10,
          '[0].bar[0]': 1,
          '[0].bar[1].yolo': true,
          '[1]': 'hello'
        };
      });
      it('should get the value', function () {
        keypather.expand(this.obj).should.eql([
          {
            foo: {
              qux: 10
            },
            bar: [
              1,
              {
                yolo: true
              }
            ]
          },
          'hello'
        ]);
      });
    });
    describe('delimeter', function() {
      before(function () {
        this.obj = {
          'foo__qux': 'hello'
        };
      });
      it('should expand the object', function(done) {
        keypather.expand(this.obj, '__').should.eql({
          foo: {
            qux: 'hello'
          }
        });
        done();
      });
    });
  });
});
