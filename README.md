#value-for-keypath [![Build Status](https://travis-ci.org/tjmehta/value-for-keypath.png?branch=master)](https://travis-ci.org/tjmehta/value-for-keypath)
##Get or Set value on an object using a keypath string. Supports bracket notation, dot notation, and functions

###installation
```bash
npm install value-for-keypath
```

### GET
####mixed notation:
```js
var valueForKeypath = require('value-for-keypath');
var obj = {
  foo: function () {
    return {
      bar: {
        baz: 'val'
      }
    };
  }
};
valueForKeypath(obj, "foo()['bar'].baz"); // val
```

####dot notation:
```js
var valueForKeypath = require('value-for-keypath');
var obj = {
  foo: {
    bar: {
      baz: 'val'
    }
  }
};
valueForKeypath(obj, "foo.bar.baz"); // val
```

####bracket notation:
```js
var valueForKeypath = require('value-for-keypath');
var obj = {
  foo: {
    bar: {
      baz: 'val'
    }
  }
};
valueForKeypath(obj, "['foo']['bar']['baz']"); // val
```

####functions:
```js
var valueForKeypath = require('value-for-keypath');
var obj = {
  foo: function () {
    return function () {
      return function () {
        return 'val';
      };
    };
  }
};
valueForKeypath(obj, "foo()()()"); // val
```

### SET
####mixed notation:
```js
var valueForKeypath = require('value-for-keypath');
var obj = {
  foo: {
      bar: {
        baz: 'val'
      }
    }
  }
};
valueForKeypath(this.obj, "foo['bar'].baz", 'value'); // value
```

####dot notation:
```js
var valueForKeypath = require('value-for-keypath');
var obj = {
  foo: {
    bar: {
      baz: 'val'
    }
  }
};
valueForKeypath(this.obj, "foo.bar.baz"); // value
```

####bracket notation:
```js
var valueForKeypath = require('value-for-keypath');
var obj = {
  foo: {
    bar: {
      baz: 'val'
    }
  }
};
valueForKeypath(this.obj, "['foo']['bar']['baz']", 'value'); // value
```
