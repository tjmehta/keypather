var valueForKeypath = module.exports = function  (obj, keypathStr, value) {
  return (arguments.length > 2) ?
    setKeypath(obj, keypathStr, value):
    getKeypath(obj, keypathStr);
};

function setKeypath (obj, keypathStr, value) {
  if (~keypathStr.indexOf('()')) {
    throw new Error("don't use set keypath with a function, it doesn't make sense");
  }
  var match = keypathStr.match(/(.*)([.]|\[["'])([^.\[]+)$/);
  if (match) {
    lastKey = match[2]+match[3];
    lastKey = ~lastKey.indexOf('.') ?
      lastKey.slice(1) :
      lastKey.slice(2, -2);
    var keypathWithoutLast = match[1];
    getKeypath(obj, keypathWithoutLast)[lastKey] = value;
  }
  else {
    obj[keypathStr] = value;
  }
  return value;
}
function getKeypath (obj, keypathStr) {
  var keyPathSplit = keypathStr.split('.');
  return keyPathSplit.reduce(getKeypathReduce, obj);
}
// private
function getKeypathReduce (val, key) {
  return reduceOpts(optsHasKey, getValue, {
    val: val,
    key: key
  });
}
function reduceOpts (condition, iterator, opts) {
  var initVal = opts.val;
  whileFunction(condition, iterator, opts);
  return opts.val;
}
function whileFunction (fn, iterator, opts) {
  if (fn(opts)) {
    iterator(opts);
    whileFunction(fn, iterator, opts);
  }
}
function optsHasKey (opts) {
  return opts.key;
}
function getValue (opts) {
  opts.indexParens = opts.key.indexOf('()');
  opts.indexOpenBracket = opts.key.indexOf('[');
  opts.indexCloseBracket = opts.key.indexOf(']');
  var keyHasParens   = ~opts.indexParens;
  var keyHasBrackets = ~opts.indexOpenBracket && ~opts.indexCloseBracket;
  if (!keyHasParens && !keyHasBrackets) {
    opts.val = opts.val[opts.key];
    opts.key = ''; // reduce done
  }
  else if (keyHasParens && (!keyHasBrackets || opts.indexParens < opts.indexOpenBracket)) {
    handleFunction(opts);
  }
  else {
    handleBrackets(opts);
  }
}
function handleFunction (opts) {
  var subKey = opts.key.slice(0, opts.indexParens);
  opts.val = subKey ?
    opts.val = opts.val[subKey]():
    opts.val = opts.val(); // back to back functions/brackets
  opts.key = opts.key.slice(opts.indexParens+2); // update key, slice of function
}
function handleBrackets (opts) {
  var subKey = opts.key.slice(0, opts.indexOpenBracket);
  var bracketKey = opts.key.slice(opts.indexOpenBracket+1, opts.indexCloseBracket);
  bracketKey = parseBracketKey(bracketKey);
  if (!bracketKey) {
    // invalid bracket structure, use key as is.
    opts.val = opts.val[opts.key];
    opts.key = ''; // reduce done
  }
  else {
    opts.val = subKey ?
      opts.val[subKey][bracketKey] :
      opts.val[bracketKey]; // back to back functions/brackets
    opts.key = opts.key.slice(opts.indexCloseBracket+1); // update key, slice off bracket notation
  }
}
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