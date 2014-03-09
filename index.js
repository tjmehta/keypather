var valueForKeypath = module.exports = function (opts) {
  var keypather = new Keypather(opts && opts.force);
  return keypather;
};

function Keypather (force) {
  this.force = (force !== undefined) ? Boolean(force) : true; // force - default: true
}
Keypather.prototype.get = function (obj, keypath) {
  this.obj = obj;
  this.keypathSplit = keypath.split('.');
  return this.keypathSplit.reduce(this.getValue.bind(this), obj);
};
Keypather.prototype.set = function (obj, keypath, value) {
  this.obj = obj;
  this.create = this.force;
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


// internal
Keypather.prototype.getValue = function (val, keyPart) {
  this.indexParens = keyPart.indexOf('()');
  this.indexOpenBracket = keyPart.indexOf('[');
  this.indexCloseBracket = keyPart.indexOf(']');
  var keyHasParens   = ~this.indexParens;
  var keyHasBrackets = ~this.indexOpenBracket && ~this.indexCloseBracket;
  this.lastVal = val;
  if (!keyHasParens && !keyHasBrackets) {
    return this.handleKey(val, keyPart);
  }
  else if (keyHasParens && (!keyHasBrackets || this.indexParens < this.indexOpenBracket)) {
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
  var subKey = keyPart.slice(0, this.indexParens);
  if (subKey) {
    if (this.create && !exists(val[subKey])) {
      throw new Error('KeypathSetError: cannot force create a path where a function does not exist');
    }
    val = (this.force && !exists(val[subKey])) ?
      null : val[subKey]();
  }
  else {
    val = (this.force && !exists(val)) ?
      null : val.call(this.lastVal || global); // maintain context
  }
  keyPart = keyPart.slice(this.indexParens+2); // update key, slice of function
  return keyPart ? // if keypart left, back to back fn or brackets so recurse
    this.getValue(val, keyPart) : val;
};
Keypather.prototype.handleBrackets = function (val, keyPart) {
  var subKey = keyPart.slice(0, this.indexOpenBracket);
  var bracketKey = keyPart.slice(this.indexOpenBracket+1, this.indexCloseBracket);
  bracketKey = parseBracketKey(bracketKey);
  if (!bracketKey) {
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