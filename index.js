var valueForKeypath = module.exports = function (opts) {
  var keypather = new Keypather(opts && opts.force);
  return keypather;
};

function Keypather (force) {
  this.force = (force !== undefined) ? Boolean(force) : true; // force - default: true
}
Keypather.prototype.get = function (obj, keypath /*, fnArgs... */) {
  this.obj = obj;
  keypath = keypath + '';
  this.create = false;
  this.keypathSplit = keypath.split('.');
  this.fnArgs = Array.prototype.slice.call(arguments, 2).map(makeArray);
  return this.keypathSplit.reduce(this.getValue.bind(this), obj);
};
Keypather.prototype.set = function (obj, keypath, value  /*, fnArgs... */) {
  this.obj = obj;
  keypath = keypath + '';
  this.create = this.force;
  this.fnArgs = Array.prototype.slice.call(arguments, 3).map(makeArray);
  if (keypath.match(/\(\)$/)) {
    throw new Error("Invalid left-hand side in assignment");
  }
  var match = keypath.match(/(.*)([.]|\[["'])([^.\[]+)$/);
  if (match) {
    lastKey = match[2]+match[3];
    lastKey = ~lastKey.indexOf('.') ?
      lastKey.slice(1) :
      lastKey.slice(2, -2);
    var keypathWithoutLast = match[1];
    this.getValue(obj, keypathWithoutLast)[lastKey] = value;
  }
  else {
    obj[keypath] = value;
  }
  return value;
};
Keypather.prototype.del = function (obj, keypath  /*, fnArgs... */) {
  this.obj = obj;
  keypath = keypath + '';
  this.create = false;
  if (last(keypath) === ')') {
    // deletes function result..does nothing. equivalent to invoking function and returning true
    this.get(obj, keypath);
    return true;
  }

  this.keypathSplit = keypath.split('.');
  var lastKey = this.getLastKey();
  var val;
  if (this.keypathSplit.length === 0) {
    val = obj;
  }
  else {
    var getArgs = Array.prototype.slice.call(arguments);
    getArgs[1] = this.keypathSplit.join('.');
    val = this.get.apply(this, getArgs);
  }

  delete val[lastKey];
  return true;
};

// internal
Keypather.prototype.getValue = function (val, keyPart) {
  this.indexOpenParen = keyPart.indexOf('(');
  this.indexCloseParen = keyPart.indexOf(')');
  this.indexOpenBracket = keyPart.indexOf('[');
  this.indexCloseBracket = keyPart.indexOf(']');
  var keyHasParens = ~this.indexOpenParen && ~this.indexCloseParen && (this.indexOpenParen < this.indexCloseParen);
  var keyHasBrackets = ~this.indexOpenBracket && ~this.indexCloseBracket && (this.indexOpenBracket < this.indexCloseBracket);
  this.lastVal = val;
  var vle;
  if (!keyHasParens && !keyHasBrackets) {
    return this.handleKey(val, keyPart);
  }
  else if (keyHasParens && (!keyHasBrackets || this.indexOpenParen < this.indexOpenBracket)) {
    return this.handleFunction(val, keyPart);
  }
  else {
    return this.handleBrackets(val, keyPart);
  }
};
Keypather.prototype.handleKey = function (val, key) {
  if (this.create && !exists(val[key])) {
    return this.createPath(val, key);
  }
  return (this.force && !exists(val)) ?
      null : val[key];
};
Keypather.prototype.handleFunction = function (val, keyPart) {
  var subKey = keyPart.slice(0, this.indexOpenParen), ctx;
  if (subKey) {
    if (this.create && !exists(val[subKey])) {
      throw new Error('KeypathSetError: cannot force create a path where a function does not exist');
    }
    ctx = val;
    val = (this.force && (!exists(val) || !exists(val[subKey]))) ? null :
      (this.indexOpenParen+1 === this.indexCloseParen) ?
        val[subKey].call(ctx) :
        val[subKey].apply(ctx, this.fnArgs.pop() || []);
  }
  else {
    ctx = this.lastVal || global;
    val = (this.force && !exists(val)) ? null :
      (this.indexOpenParen+1 === this.indexCloseParen) ? // maintain context (this.lastVal)
        val.call(ctx) :
        val.apply(ctx, this.fnArgs.pop() || []);
  }
  keyPart = keyPart.slice(this.indexCloseParen+1); // update key, slice of function
  return keyPart ? // if keypart left, back to back fn or brackets so recurse
    this.getValue(val, keyPart) : val;
};
Keypather.prototype.handleBrackets = function (val, keyPart) {
  var subKey = keyPart.slice(0, this.indexOpenBracket);
  var bracketKey = keyPart.slice(this.indexOpenBracket+1, this.indexCloseBracket);
  bracketKey = parseBracketKey(bracketKey);
  if (!exists(bracketKey)) {
    // invalid bracket structure, use key as is.
    return this.handleKey(val, keyPart);
  }
  else {
    if (subKey) {
      if (this.create && !exists(val[subKey])) {
        return this.createPath(val, subKey, bracketKey);
      }
      val = (this.force && (!exists(val) || !exists(val[subKey]))) ?
        null : val[subKey][bracketKey];
    }
    else {
      if (this.create && !exists(val[bracketKey])) {
        return this.createPath(val, bracketKey);
      }
      val = (this.force && !exists(val)) ?
        null : val[bracketKey];
    }
    keyPart = keyPart.slice(this.indexCloseBracket+1); // update key, slice off bracket notation
    return keyPart ? // if keypart left, back to back fn or brackets so recurse
      this.getValue(val, keyPart) : val;
  }
};
Keypather.prototype.getLastKey = function () {
  var lastKeyPart = this.keypathSplit.pop();
  var indexOpenBracket = lastKeyPart.lastIndexOf('[');
  var indexCloseBracket = lastKeyPart.lastIndexOf(']');
  var keyHasBrackets = ~indexOpenBracket && ~indexCloseBracket && (indexOpenBracket < indexCloseBracket);

  if (keyHasBrackets) {
    var bracketKey = lastKeyPart.slice(indexOpenBracket+1, indexCloseBracket);
    bracketKey = parseBracketKey(bracketKey);
    lastKeyPart = lastKeyPart.slice(0, indexOpenBracket);
    this.keypathSplit.push(lastKeyPart);
    return bracketKey;
  }
  else {
    return lastKeyPart;
  }
};
Keypather.prototype.createPath = function (val /*, keys */) {
  var keys = Array.prototype.slice.call(arguments, 1);
  return keys.reduce(function (val, key) {
    val[key] = {};
    return val[key];
  }, val);
};

function parseBracketKey (key) {
  key = key.replace(/'/g, '"'); // single quotes to double
  try {
    return JSON.parse(key);
  }
  catch (err) { //invalid
    console.error(err);
    return;
  }
}

function exists (val) {
  return val !== null && val !== undefined;
}
function last (arrOrStr) {
  return arrOrStr[arrOrStr.length - 1];
}
function makeArray (val) {
  return Array.isArray(val) ? val : [val];
}