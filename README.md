# value-for-keypath [![Build Status](https://travis-ci.org/tjmehta/value-for-keypath.png?branch=master)](https://travis-ci.org/tjmehta/value-for-keypath)

Get or Set value on an object using a keypath string. Supports bracket notation, dot notation, and functions

# installation
```bash
npm install value-for-keypath
```

# Examples

## GET

dot notation, bracket notation, and functions all supported:

```js
var keypath = require('value-for-keypath')();
var obj = {
  foo: {
    bar: {
      baz: 'val'
    }
  }
};
keypath.get(obj, "foo.bar.baz"); // val
keypath.get(obj, "['foo']['bar']['baz']"); // val
```

```js
var keypath = require('value-for-keypath')();
var obj = {
  foo: function () {
    return function () {
      return function () {
        return 'val';
      };
    };
  }
};
keypath.get(obj, "foo()()()"); // val
```

```js
var keypath = require('value-for-keypath')();
var obj = {
  foo: function () {
    return {
      bar: {
        baz: 'val'
      }
    };
  }
};
keypath.get(obj, "foo()['bar'].baz"); // val
```

Get returns null for keypaths that do not exist by default,
but can also throw errors with `{ force: false }`

```js
var keypath = require('value-for-keypath')(); // equivalent to { force:true }
var obj = {};
keypath.get(obj, "foo.bar.baz"); // null

var keypath = require('value-for-keypath')( force: false );
var obj = {};
keypath.get(obj, "foo.bar.baz");
// throw's an error
// Error: Cannot get 'foo' of undefined
```

## SET

mixed notation, dot notation, and bracket notation all supported:

```js
var keypath = require('value-for-keypath')();
var obj = {
  foo: {
      bar: {
        baz: 'val'
      }
    }
  }
};
keypath.set(obj, "foo['bar'].baz", 'value'); // value
keypath.set(obj, "foo.bar.baz", 'value'); // value
keypath.set(obj, "['foo']['bar']['baz']", 'value'); // value
```

 Set forces creation by default:

```js
var keypath = require('value-for-keypath')(); // equivalent to { force:true }
var obj = {};
keypath.set(obj, "foo.bar.baz", 'val'); // value
// obj = {
//   foo: {
//     bar: {
//       baz: 'val'
//     }
//   }
// };

var keypath = require('value-for-keypath')( force: false );
var obj = {};
keypath.set(obj, "foo.bar.baz", 'val');
// throw's an error
// Error: Cannot get 'foo' of undefined
```

# License
### MIT