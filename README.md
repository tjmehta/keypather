# keypather [![Build Status](https://travis-ci.org/tjmehta/keypather.png?branch=master)](https://travis-ci.org/tjmehta/keypather)

Get or set a object values from a keypath string. Supports bracket notation, dot notation, and mixed notation.
Ignores errors for deep keypaths by default.

Safely handles string expressions - *No* ```eval``` or ```new Function``` code here!

# Installation
```bash
npm install keypather
```

# Examples

# Usage

## Import

With require:

```js
var getKeypath = require('keypather/get')
var setKeypath = require('keypather/set')
var delKeypath = require('keypather/del')
var keypathIn = require('keypather/in')
var hasKeypath = require('keypather/has')
var expand = require('keypather/expand')
var flatten = require('keypather/flatten')
```

With ES6 import:

```js
import getKeypath from 'keypather/get'
import setKeypath from 'keypather/set'
import delKeypath from 'keypather/del'
import keypathIn from 'keypather/in'
import hasKeypath from 'keypather/has'
import expand from 'keypather/expand'
import flatten from 'keypather/flatten'
```

## GET

dot notation, bracket notation, and mixed notation all supported:

```js
var getKeypath = require('keypather/get');
var obj = {
  foo: {
    bar: {
      baz: 'val'
    }
  }
};
getKeypath(obj, "foo.bar.baz"); // val
getKeypath(obj, "['foo']['bar']['baz']"); // val
```

```js
var getKeypath = require('keypather/get');
var obj = {
  foo: function () {
    return function () {
      return function () {
        return 'val';
      };
    };
  }
};
getKeypath(obj, "foo()()()"); // val
```

```js
var getKeypath = require('keypather/get');
var obj = {
  foo: function () {
    return {
      bar: {
        baz: 'val'
      }
    };
  }
};
getKeypath(obj, "foo()['bar'].baz"); // val
```

Get returns `undefined` for keypaths that do not exist by default,
but can also throw errors with `{ force: false }`

```js
var getKeypath = require('keypather/get');
var obj = {}

// opts defaults to { force:true }
getKeypath(obj, "foo.bar.baz");
// returns undefined

// use force: false to throw errors for non-existant paths
getKeypath(obj, "foo.bar.baz", { force: false });
// throw's an error
// Error: Cannot read property 'bar' of undefined (for keypath 'foo.bar.qux')
```

## SET

dot notation, bracket notation, and mixed notation all supported:

```js
var setKeypath = require('keypather/set');
var obj = {
  foo: {
      bar: {
        baz: 'val'
      }
    }
  }
};
setKeypath(obj, "foo['bar'].baz", 'value'); // value
setKeypath(obj, "foo.bar.baz", 'value'); // value
setKeypath(obj, "['foo']['bar']['baz']", 'value'); // value
```

Set forces creation by default:

```js
var keypath = require('keypather')(); // equivalent to { force:true }

setKeypath({}, "foo.bar.baz", 'val');
// returns 'val'
// object becomes:
// {
//   foo: {
//     bar: {
//       baz: 'val'
//     }
//   }
// };

setKeypath({}, "foo.bar.baz", 'val', { force: false });
// throw's an error
// Error: Cannot read property 'bar' of undefined (for keypath 'foo.bar.qux')
```

## IN

Equivalent to `key in obj`

```js
var keypathIn = require('keypather/in');
var obj = {
  foo: {
      bar: {
        baz: 'val'
      }
    }
  }
};
keypathIn(obj, "foo['bar'].baz");        // true
keypathIn(obj, "foo.bar.baz");           // true
keypathIn(obj, "['foo']['bar']['baz']"); // true
```

## HAS

Equivalent to `obj.hasOwnProperty`

```js
var hasKeypath = require('keypather/has');
var obj = {
  foo: {
      bar: {
        baz: 'val'
      }
    }
  }
};
hasKeypath(obj, "foo['bar'].baz");        // true
hasKeypath(obj, "foo.bar.baz");           // true
hasKeypath(obj, "['foo']['bar']['baz']"); // true
```

## DEL

Equivalent to `delete obj.key`

```js
var delKeypath = require('keypather/del');
var obj = {
  foo: {
      bar: {
        baz: 'val'
      }
    }
  }
};
delKeypath(obj, "foo['bar'].baz");        // true
delKeypath(obj, "foo.bar.baz");           // true
delKeypath(obj, "['foo']['bar']['baz']"); // true
// obj becomes:
// {
//   foo: {
//     bar: {}
//   }
// }

```

## FLATTEN

Flatten an object or array into a keypath object

```js
var flatten = require('keypather/flatten')();

flatten({
  foo: {
    qux: 'hello'
  },
  bar: [
    1,
    {
      yolo: [1]
    }
  ]
});
// returns:
// {
//   'foo.qux': 'hello',
//   'bar[0]': 1,
//   'bar[1].yolo[0]': 1
// }

/* accepts a delimiter other than '.' as second arg */

flatten({
  foo: {
    qux: 'hello'
  }
}, '_');
// returns:
// {
//   'foo_qux': 'hello',
// }

```

## EXPAND

Expand a flattened object back into an object or array

```js
var expand = require('keypather/expand');

expand({
  'foo.qux': 'hello',
  'bar[0]': 1,
  'bar[1].yolo[0]': 1
});
// returns:
// {
//   foo: {
//     qux: 'hello'
//   },
//   bar: [
//     1,
//     {
//       yolo: [1]
//     }
//   ]
// }

/* expand will assume an object is an array if any of the keys are numbers */

expand({
  '[0]': 1,
  '[1].yolo[0]': 1
});
// returns:
// [
//   1,
//   {
//     yolo: [1]
//   }
// ]

/* accepts a delimiter other than '.' as second arg */

expand({
 'foo_qux': 'hello'
}, '_');
// returns:
// {
//   foo: {
//     qux: 'hello'
//   }
// }
```

# Changelog
[Changelog history](https://github.com/tjmehta/keypather/blob/master/CHANGELOG.md)

# License
### MIT
