![keypather-logo](https://i.imgur.com/wFm1N25.png)

# keypather [![Build Status](https://travis-ci.org/tjmehta/keypather.png?branch=master)](https://travis-ci.org/tjmehta/keypather) [![Coverage Status](https://coveralls.io/repos/github/tjmehta/keypather/badge.svg?branch=immutable-methods)](https://coveralls.io/github/tjmehta/keypather?branch=immutable-methods) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

Get, set, or delete a deep value using a keypath string.

A collection of keypath utilities: get, set, delete, in, has, flatten, expand, and immutable set/delete.

Lightweight and parses keypaths using vanilla JS - No ```eval``` or ```new Function``` hacks!

# Installation
```bash
npm install keypather
```

# Usage

## Examples

### Import
```js
// modular imports, so you can keep your bundle lean
const get = require('keypather/get')
const set = require('keypather/set')
const del = require('keypather/del')
const immutableSet = require('keypather/immutable-set')
const immutableDel = require('keypather/immutable-del')
const keypathIn = require('keypather/in')
const hasKeypath = require('keypather/has')
const expand = require('keypather/expand')
const flatten = require('keypather/flatten')
```

### GET, SET, DEL Example
```js
const get = require('keypather/get')
const set = require('keypather/set')
const del = require('keypather/del')

let obj

// Objects
obj = { foo: { bar: 100 } }
get(obj, 'foo.bar')          // returns 100
del(obj, '["foo"]["bar"]')   // returns true, obj becomes { foo: {} }
set(obj, 'foo.bar.qux', 200) // returns 200, obj becomes { foo: { bar: { qux: 200 } } }
get(obj, 'foo["bar"].qux')   // returns 200

// Arrays
obj = {}
set(obj, 'foo[0]', 100)      // obj is { foo: [ 100 ] }
```

### Immutable SET, DEL Example
```js
const set = require('keypather/immutable-set')
const del = require('keypather/immutable-del')

let obj
let out

// Objects
obj = { foo: { bar: 100 } }
out = set(obj, 'foo.bar', 100)     // returns obj
// out === obj,
// since it was not modified
out = set(obj, 'foo.bar.qux', 200) // returns { foo: { bar: { qux: 200 } } }
// out !== obj,
// obj is still { foo: { bar: 100 } }
out = del(obj, 'one.two.three')    // returns obj
// out === obj,
// since it was not modified
out = del(obj, 'foo.bar.qux')     // returns { foo: { bar: {} } }
// out !== obj,
// obj is still { foo: { bar: { qux: 200 } } }

// Arrays
obj = {}
out = set(obj, 'foo[0]', 100) // returns { foo: [ 100 ] } (new)
// out !== obj, obj is still { foo: { bar: 100 } }
```

### HAS, IN Example
```js
const hasKeypath = require('keypather/has')
const keypathIn = require('keypather/in')

const obj = { foo: Object.create({ bar: 100 }) }

hasKeypath(obj, 'foo.bar') // returns false (bar is on proto)
keypathIn(obj, 'foo.bar')  // returns true
hasKeypath(obj, 'foo')     // returns true
```

### FLATTEN, EXPAND Example
```js
const expand = require('keypather/expand')
const flatten = require('keypather/flatten')

const obj = expand({
  'foo.bar': 1,
  'foo.qux[0]': 100,  
  'foo["qux"][1]': 200,
  'foo.qux.wut': 'val'
})
// obj is { foo { bar: 1, qux: [ 100, 200, wut: 'val' ] } }
const flat = flatten(obj)
// flat is { 'foo.bar': 1, 'foo.qux': 2 } }
```

### Errors Example
```js
/* Missing deep values w/ "force: false" */
get({}, 'foo.bar', { force: false })
set({}, 'foo.bar', 100, { force: false })
del({}, 'foo.bar', { force: false })
immutableSet({}, 'foo.bar', 100, { force: false })
immutableDel({}, 'foo.bar', { force: false })
// TypeError: Cannot read property 'bar' of undefined (at keypath 'foo' of 'foo.bar')
get({ foo: {} }, 'foo.bar', { force: false })
set({ foo: {} }, 'foo.bar', 100, { force: false })
del({ foo: {} }, 'foo.bar', { force: false })
immutableSet({ foo: {} }, 'foo.bar', 100, { force: false })
immutableDel({ foo: {} }, 'foo.bar', { force: false })
// TypeError: Cannot read property 'bar' of undefined (at keypath 'foo.bar' of 'foo.bar.qux')
hasKeypath({}, 'foo.bar', { force: false })
// TypeError: Cannot read property 'hasOwnProperty' of undefined (hasOwnProperty('bar') errored at keypath 'foo' of 'foo.bar')
keypathIn({}, 'foo.bar', { force: false })
// TypeError: Cannot use 'in' operator to search for 'bar' in undefined (at 'foo' of 'foo.bar')
keypathIn({}, 'foo.bar.qux', { force: false })
hasKeypath({}, 'foo.bar.qux', { force: false })
// TypeError: Cannot read property 'bar' of undefined (at keypath 'foo' of 'foo.bar.qux')

/* Warnings for set and immutable-set */
// by default, set will overwrite primitives (string, number or regexp) to an object or array.
// when overwritePrimitives is set to false, sets will warn when settings a key on a primitive
// to disable all warnings use the option { warn: false }
set({}, '[0]', 'val', { overwritePrimitives: false })
// log: Setting number key (0) on object at keypath '' of '[0]')
set([], 'key', 'val', { overwritePrimitives: false })
// log: Setting string key 'foo' on array at keypath '' of 'foo')
set({ foo: 1 }, 'foo.qux', 'val', { overwritePrimitives: false })
// log: Setting key 'qux' on number 1 at keypath 'foo' of 'foo.qux')
set({ foo: 1 }, 'foo[0]', 'val', { overwritePrimitives: false })
// log: Setting number key (0) on number 1 at keypath 'foo' of 'foo[0]')
set({ foo: 'str' }, 'foo.bar', 'val', { overwritePrimitives: false })
// log: Setting key 'bar' on string 'str' at keypath 'foo' of 'foo.bar')
set({ foo: {} }, 'foo[0]', 'val', { overwritePrimitives: false })
// log: Setting number key (0) on object at keypath 'foo' of 'foo[0]')

/* Invalid keypaths */
get({}, 'foo.1bar')
// Error: Unexpected token '1' in keypath 'foo.1bar' at position 4 (invalid dot key)
get({}, 'foo[]')       
// Error: Unexpected token ']' in keypath 'foo[]' at position 4 (invalid bracket key)
get({}, 'foo["]')
// Error: Unexpected token ']' in keypath 'foo[]' at position 5 (invalid bracket string key)
get({}, 'foo.')
// Error: Unexpected end of keypath 'foo.' (invalid dot key)
get({}, 'foo[')
// Error: Unexpected end of keypath 'foo[' (invalid bracket key)
get({}, "foo['")
// Error: Unexpected end of keypath 'foo['' (invalid bracket string key)
```

## Documentation

### GET
Returns value at keypath in obj
* @param {any} obj - context to read keypath from
* @param {string} keypath - bracket and/or dot notation keypath string
* @param {?object} opts - optional, defaults to { force: true }
*   opts.force - force specifies whether non-existant keypaths should be ignored, defaults to true
*     if false, `get` will error when reading a key on a non-existant keypath.
* @returns {any} value at keypath

```js
const get = require('keypather/get');
const obj = {
  foo: {
    bar: {
      baz: 'val'
    }
  }
};
get(obj, "foo.bar.baz");           // returns 'val'
get(obj, "foo['bar'].baz");        // returns 'val'
get(obj, "['foo']['bar']['baz']"); // returns 'val'

get({}, 'foo.two.three', { force: false }) // throws error
// TypeError: Cannot read property 'three' of undefined (at keypath 'foo.two' of 'foo.two.three')
```

### SET
Sets a value in obj at keypath. If force=true, set will create objects at non-existant keys in the
keypath. If the non-existant key is a number, its value will be initialized as an array.
* @param {any} obj - context to read keypath from
* @param {string} keypath - bracket and/or dot notation keypath string to read from obj
* @returns {any} value - value to set at keypath
* @param {?object} opts - optional, defaults to { force: true, overwritePrimitives: true, warn: true }
*   opts.force - whether non-existant keys in keypath should be created, defaults to true.
*     if false, `set` will error when reading a key on a non-existant keypath.
*   opts.overwritePrimitives - whether primitive keys (booleans, strings, numbers) should be overwritten.
*     setting a key on a primitive will convert it to an object or array (if key is string or number).
*     if false, `set` will log a warning when setting keys on primitives.
*   opts.silent - specifies whether warning logs should be enabled, defaults to false.
* @returns {any} value set at keypath

```js
const set = require('keypather/set');

let obj = {
  foo: {
    bar: {
      baz: 'val'
    }
  }
};
set(obj, "foo['bar'].baz", 'val');        // returns 'val'
set(obj, "foo.bar.baz", 'val');           // returns 'val'
set(obj, "['foo']['bar']['baz']", 'val'); // returns 'val'

/* By default, set forces creation of non-existant keys */
obj = {}
set(obj, "foo.bar.baz", 'val'); // returns 'val'
// obj becomes:
// {
//   foo: {
//     bar: {
//       baz: 'val'
//     }
//   }
// };

/* By default, overwrites primitives when setting a key on one */
obj = { foo: 1 }
set(obj, "foo.bar.baz", 'val'); // returns 'val'
// obj becomes:
// {
//   foo: {
//     bar: {
//       baz: 'val'
//     }
//   }
// };
obj = { foo: 1 }
set(obj, "foo[0].baz", 'val'); // returns 'val'
// obj becomes:
// {
//   foo: [{
//     baz: 'val'
//   }]
// };

/* Errors, force=false */
set({}, "foo.bar.baz", 'val', { force: false }); // throw's an error
// TypeError: Cannot read property 'bar' of undefined (at keypath 'foo' of 'foo.bar.baz')
// see more errors above in the 'Errors' section

/* Warnings, overwritePrimitives=false */
set({ foo: 'str' }, 'foo.bar', 'val', { overwritePrimitives: false })
// log: Setting key 'bar' on string 'str' at keypath 'foo' of 'foo.bar')
// see more warnings above in the 'Errors' section
```

### DEL
Deletes value a keypath in obj. Similar to `delete obj.key`.
* @param {any} obj - context to read keypath from
* @param {string} keypath - bracket and/or dot notation keypath string to delete from obj
* @param {?object} opts - optional, defaults to { force: true }
*   opts.force - whether non-existant keys in keypath should be created, defaults to true.
*     if false, `del` will error when reading a key on a non-existant keypath.
* @returns {boolean} true except when the property is non-configurable or in non-strict mode

```js
const del = require('keypather/del');

const obj = {
  foo: {
    bar: {
      baz: 'val'
    }
  }
};
del(obj, "foo['bar'].baz");        // true
del(obj, "foo.bar.baz");           // true
del(obj, "['foo']['bar']['baz']"); // true
// obj becomes:
// {
//   foo: {
//     bar: {}
//   }
// }

/* Errors, force=false */
del(obj, "one.two.three", 'val', { force: false }); // throw's an error
// TypeError: Cannot read property 'two' of undefined (at keypath 'one' of 'one.two.three')
// see more errors above in the 'Errors' section
```

### IMMUTABLE SET
Sets a value in obj at keypath. If force=true, set will create objects at non-existant keys in the
keypath. If the non-existant key is a number, its value will be initialized as an array.
* @param {any} obj - context to read keypath from
* @param {string} keypath - bracket and/or dot notation keypath string to read from obj
* @returns {any} value - value to set at keypath
* @param {?object} opts - optional, defaults to { force: true, overwritePrimitives: true, warn: true }
*   opts.force - whether non-existant keys in keypath should be created, defaults to true.
*     if false, `immutable-set` will error when reading a key on a non-existant keypath.
*   opts.overwritePrimitives - whether primitive keys (booleans, strings, numbers) should be overwritten.
*     setting a key on a primitive will convert it to an object or array (if key is string or number).
*     if false, `immutable-set` will log a warning when setting keys on primitives.
*   opts.silent - specifies whether warning logs should be enabled, defaults to false.
*   opts.shallowClone - provide custom shallowClone, defaults to [shallow-clone](https://npmrepo.com/shallow-clone)
* @returns {any} returns same obj if unmodified, otherwise modified clone of obj

```js
const set = require('keypather/immutable-set');

let obj = {
  foo: {
    bar: {
      baz: 'val'
    }
  }
};
let out
out = set(obj, "foo['bar'].baz", 'val');         // returns SAME object, since the value was unchanged
// out === obj
out = set(obj, "foo.bar.baz", 'val2');           // returns { foo: { bar: { baz: 'val2' } } } (new object)
// out !== obj
out = set(obj, "['foo']['bar']['baz']", 'val3'); // returns { foo: { bar: { baz: 'val3' } } } (new object)
// out !== obj

/* By default, overwrites primitives when setting a key on one */
obj = { foo: 1 }
out = set(obj, "foo.bar.baz", 'val'); // returns new object
// out !== obj
// out is:
// {
//   foo: {
//     bar: {
//       baz: 'val'
//     }
//   }
// };
obj = { foo: 1 }
out = set(obj, "foo[0].baz", 'val'); // returns new object
// out !== obj
// out is:
// {
//   foo: [{
//     baz: 'val'
//   }]
// };

/* Errors, force=false */
obj = {}
set(obj, "foo.bar.baz", 'val', { force: false }); // throws error
// Error: Cannot read property 'bar' of undefined (at keypath 'foo' of 'foo.bar.baz')

/* Warnings, force=false */
obj = { foo: 'str' }
out = set(obj, 'foo.bar', 'val', { overwritePrimitives: false })
// out === obj, since keys cannot be set on strings or numbers
// log: Setting key 'bar' on string 'str' at keypath 'foo' of 'foo.bar')
```

### IMMUTABLE DEL
Deletes value a keypath in obj. Similar to `delete obj.key`.
* @param {any} obj - context to read keypath from
* @param {string} keypath - bracket and/or dot notation keypath string to delete from obj
* @param {?object} opts - optional, defaults to { force: true }
*   opts.force - whether non-existant keys in keypath should be created, defaults to true.
*     if false, `del` will error when reading a key on a non-existant keypath.
*   opts.shallowClone - provide custom shallowClone, defaults to [shallow-clone](https://npmrepo.com/shallow-clone)
* @returns {any} returns same obj if unmodified, otherwise modified clone of obj

```js
const del = require('keypather/immutable-del');
const obj = {
  foo: {
    bar: {
      baz: 'val'
    }
  }
};
let out
out = del(obj, "foo['bar'].baz");        // true
out = del(obj, "foo.bar.baz");           // true
out = del(obj, "['foo']['bar']['baz']"); // true
// obj becomes:
// {
//   foo: {
//     bar: {}
//   }
// }

/* Errors, force=false */
del(obj, "one.two.three", 'val', { force: false }); // throw's an error
// Error: Cannot read property 'two' of undefined (at keypath 'one' of 'one.two.three')
```

### IN
Returns true if keypath is "in" the obj at the keypath. Similar to "in" operator.
* @param {any} obj - context to read keypath in
* @param {string} keypath - bracket and/or dot notation keypath string to read from obj
* @param {?object} opts - optional, defaults to { force: true }
*   opts.force - force specifies whether non-existant keypaths should be ignored, defaults to true
* @returns {boolean} true if the keypath is "in" the obj, else false

```js
const keypathIn = require('keypather/in');
const obj = {
  foo: {
    bar: {
      baz: 'val'
      __proto__: {
        qux: 'val'
      }
    }
  }
};
keypathIn(obj, "foo.bar.baz");           // true
keypathIn(obj, "foo.bar.qux");           // true
keypathIn(obj, "foo.bar.bing");          // false
keypathIn(obj, "foo['bar'].baz");        // true
keypathIn(obj, "one.two.three");         // false

// Errors, force=false
keypathIn(obj, "one.two.three", { force: false });
// Error: Cannot read property 'two' of undefined (at keypath 'two' of 'one.two.three')
keypathIn(obj, "foo.two.three", { force: false });
// TypeError: Cannot use 'in' operator to search for 'three' in undefined (at 'foo.two' of 'foo.two.three')
```

### HAS
Returns true if the obj has the keypath. Similar to `obj.hasOwnProperty`.
* @param {any} obj - context to read keypath in
* @param {string} keypath - bracket and/or dot notation keypath string to read from obj
* @param {?object} opts - optional, defaults to { force: true }
*   opts.force - force specifies whether non-existant keypaths should be ignored, defaults to true
* @returns {boolean} true if the keypath is "in" the obj, else false

```js
const hasKeypath = require('keypather/has');
const obj = {
  foo: {
    bar: {
      baz: 'val'
      __proto__: {
        qux: 'val'
      }
    }
  }
};
hasKeypath(obj, "foo.bar.baz");           // true
hasKeypath(obj, "foo.bar.qux");           // false
hasKeypath(obj, "['foo']['bar']['baz']"); // true
hasKeypath(obj, "one.two.three");         // false

// Errors, force=false
hasKeypath(obj, "one.two.three", { force: false }); // throw's an error
// Error: Cannot read property 'two' of undefined (at keypath 'two' of 'one.two.three
hasKeypath(obj, "foo.two.three", { force: false });
// Error: Cannot read property 'hasOwnProperty' of undefined (hasOwnProperty('three') errored at keypath 'foo.two' of 'foo.two.three')
```

### FLATTEN
Flatten an object or array into a keypath object
* @param {any} obj - object or array to flatten

```js
const flatten = require('keypather/flatten');

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

### EXPAND
Expand a flattened object back into an object or array
* @param {any} obj - flattened object or array to be expanded

```js
const expand = require('keypather/expand');

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
