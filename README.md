# keypather [![Build Status](https://travis-ci.org/tjmehta/keypather.png?branch=master)](https://travis-ci.org/tjmehta/keypather)

Get or set a object values from a keypath string. Supports bracket and dot notation.
Ignores errors for missing deep keypaths by default.

Parses keypath using vanilla JS - No ```eval``` or ```new Function``` hacks!

# Installation
```bash
npm install keypather
```

# Usage

## Examples

### Import
```js
const get = require('keypather/get')
const set = require('keypather/set')
const del = require('keypather/del')
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
del(obj, '["foo"]["bar"]')   // obj becomes { foo: {} }, returns true
set(obj, 'foo.bar.qux', 200) // obj becomes { foo: { bar: { qux: 200 } } }, returns 200
get(obj, 'foo["bar"].qux')   // returns 200

// Arrays
obj = {}
set(obj, 'foo[0]', 100)      // obj is { foo: [ 100 ] }
```

### HAS, IN Example
```js
const hasKeypath = require('keypather/has')
const keypathIn = require('keypather/in')

const obj = { foo: Object.create({ bar: 100 }) }

hasKeypath(obj, 'foo.bar') // returns false
keypathIn(obj, 'foo.bar')  // returns true
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
// TypeError: Cannot read property 'bar' of undefined (at keypath 'foo' of 'foo.bar')
get({ foo: {} }, 'foo.bar', { force: false })
set({ foo: {} }, 'foo.bar', 100, { force: false })
del({ foo: {} }, 'foo.bar', { force: false })
// TypeError: Cannot read property 'bar' of undefined (at keypath 'foo.bar' of 'foo.bar.qux')
hasKeypath({}, 'foo.bar', { force: false })
// TypeError: Cannot read property 'hasOwnProperty' of undefined (hasOwnProperty('bar') errored at keypath 'foo' of 'foo.bar')
keypathIn({}, 'foo.bar', { force: false })
// TypeError: Cannot use 'in' operator to search for 'bar' in undefined (at 'foo' of 'foo.bar')
keypathIn({}, 'foo.bar.qux', { force: false })
hasKeypath({}, 'foo.bar.qux', { force: false })
// TypeError: Cannot read property 'bar' of undefined (at keypath 'foo' of 'foo.bar.qux')

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
Returns value of obj at keypath
* @param {any} obj - context to read keypath from
* @param {string} keypath - bracket and/or dot notation keypath string
* @param {?object} opts - optional, defaults to { force: true }
*   opts.force - force specifies whether non-existant keypaths should be ignored, defaults to true
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
```

### SET
Sets a value in obj at keypath. If force=true, set will intelligently create objects at non-existant
keys in the keypath. If the non-existant key is a number, its value will be initialized as an array.
* @param {any} obj - context to read keypath from
* @param {string} keypath - bracket and/or dot notation keypath string to read from obj
* @returns {any} value - value to set at keypath
* @param {?object} opts - optional, defaults to { force: true }
*   opts.force - force specifies whether non-existant keys in keypath should be created, defaults to true
* @returns {any} value set at keypath

```js
const set = require('keypather/set');
const obj = {
  foo: {
    bar: {
      baz: 'val'
    }
  }
};
set(obj, "foo['bar'].baz", 'val');        // returns 'val'
set(obj, "foo.bar.baz", 'val');           // returns 'val'
set(obj, "['foo']['bar']['baz']", 'val'); // returns 'val'
```

Set forces creation by default:

```js
const set = require('keypather/set'); // equivalent to { force:true }

set({}, "foo.bar.baz", 'val'); // returns 'val'
// object becomes:
// {
//   foo: {
//     bar: {
//       baz: 'val'
//     }
//   }
// };

// Errors, force=false
set({}, "foo.bar.baz", 'val', { force: false }); // throw's an error
// Error: Cannot read property 'bar' of undefined (at keypath 'foo' of 'foo.bar.baz')
```

### DEL
Deletes value a keypath in obj. Similar to `delete obj.key`.
* @param {any} obj - context to read keypath from
* @param {string} keypath - bracket and/or dot notation keypath string to delete from obj
* @param {?object} opts - optional, defaults to { force: true }
*   opts.force - force specifies whether non-existant keypaths should be ignored, defaults to true
* @returns {boolean} true for all cases except when the property is non-configurable, false in non-strict mode

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

// Errors, force=false
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
* @param {any} obj - flattened object or array

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
