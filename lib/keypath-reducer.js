var assert = require('assert')

var escRE = require('escape-string-regexp')
var exists = require('101/exists')
var defaults = require('101/defaults')
var debug = require('debug')('keypather:reducer')
var stringReduce = require('string-reduce')

var slash = '\\'

module.exports = keypatherReducer

function keypatherReducer (state, operation, opts) {
  debug('keypather %O %O', state, opts)
  global.ctx = state.ctx
  opts = opts || {}
  defaults(opts, {
    force: true,
    delimeter: '.'
  })
  var dot = opts.delimeter
  var keyStartRegex = new RegExp('[' + escRE(opts.delimeter) + '\\[]')
  var initialState = {
    ctx: state.ctx,
    parentCtx: state.parentCtx || null,
    // static args
    keypath: state.keypath,
    val: state.val,
    funcArgs: state.funcArgs,
    // loop state
    i: null,
    character: null,
    lastCharacter: null,
    // position state
    keypathSplit: state.keypathSplit || [],
    keyStart: null,
    keyEnd: null,
    insideBracket: false,
    insideBracketNumber: false,
    insideBracketString: false,
    quoteCharacter: null,
    // operation state
    createOperation: state.createOperation || {
      createdKeypaths: {
        /* <normalizedKeypath>: true */
      }
    }
  }
  var state = stringReduce(state.keypath, reducer, initialState)
  state = reducer(state, 'END', state.keypath.length, initialState.keypath)
  function reducer (state, character, i, keypath) {
    var key
    state.i = i
    state.lastLastCharacter = keypath.charAt(i - 2)
    state.lastCharacter = state.character
    state.character = character
    debug('step %O %O %O', character, state, i)
    if (state.closedBracket) {
      var endFound = character === 'END' || keyStartRegex.test(character)
      if (!endFound) throw new Error(parseErrorMessage(state, 'invalid bracket key'))
      state.closedBracket = false
      state.insideBracket = character === '['
    } else if (state.insideBracketString) {
      // state: inside bracket
      state.keyStart = state.keyStart || i
      // greedily check for key end, by checking for next section start
      // unfortunately this is the best I could come up with w/out being
      // able to check for escaped chars in js
      var endFound = character === 'END' || keyStartRegex.test(character)
      debug('insideBracketString %O %O %O', character, endFound, state.lastCharacter === ']', state.lastLastCharacter === state.quoteCharacter)
      if (!endFound) return state
      if (state.lastCharacter !== ']') {
        if (character === 'END') throw new Error(parseErrorMessage(state, 'invalid bracket string key'))
        return state
      }
      if (state.lastLastCharacter !== state.quoteCharacter) {
        if (character === 'END') throw new Error(parseErrorMessage(state, 'invalid bracket string key'))
        return state
      }
      // state: closed bracket
      state.keyEnd = i - 2
      // state: inside bracket, closed string
      key = keypath.substring(state.keyStart, state.keyEnd)
      debug('handleKey bracket-string %O %O %O', key, state.ctx, character)
      handleKey(operation, key, state, opts)
      state.insideBracket = state.character === '['
      state.insideBracketString = false
      state.quoteCharacter = null
    } else if (state.insideBracketNumber) {
      // state: inside bracket, inside number
      if (!/^[0-9\]]$/.test(character)) throw new Error(parseErrorMessage(state, 'invalid bracket number key'))
      if (character === ']') {
        // state: closed bracket number
        state.keyEnd = i
        key = keypath.substring(state.keyStart, state.keyEnd)
        key = parseInt(key, 10)
        // not necesary bc regex above:
        // if (isNaN(key)) throw new Error(parseErrorMessage(state, 'invalid bracket number key'))
        debug('handleKey bracket-number %O %O %O', key, state.ctx, character)
        handleKey(operation, key, state, opts)
        state.insideBracket = false
        state.insideBracketNumber = false
        state.closedBracket = true
      }
    } else if (state.insideBracket) {
      // state: inside bracket
      if (/^["']$/.test(character)) {
        // inside bracket string start
        state.insideBracketString = true
        state.quoteCharacter = character
      } else if (/^[0-9]$/.test(character)) {
        // inside bracket number start
        state.insideBracketNumber = true
        state.keyStart = i
      } else {
        throw new Error(parseErrorMessage(state, 'invalid bracket key'))
      }
    } else {
      if (character === 'END') {
        // state: keypath end
        if (!exists(state.keyStart)) return state
        // hack: follow dot path
        character = dot
      }
      if (character === dot) {
        if (!exists(state.keyStart)) throw new Error(parseErrorMessage(state, 'invalid dot key'))
        // state: key end
        state.keyEnd = state.keyEnd || i
        key = keypath.substring(state.keyStart, state.keyEnd)
        debug('handleKey dot %O %O %O', key, state.ctx, character)
        handleKey(operation, key, state, opts)
        // state: dot key start
      } else if (character === '[') {
        if (i !== 0 && state.lastCharacter !== ']') {
          // state: dot key end
          if (!exists(state.keyStart)) throw new Error(parseErrorMessage(state, 'invalid dot key'))
          state.keyEnd = state.keyEnd || i
          key = keypath.substring(state.keyStart, state.keyEnd)
          debug('handleKey pre-bracket %O %O %O', key, state.ctx, character)
          handleKey(operation, key, state, opts)
        } // else bracket key start after bracket
        // state: bracket key start
        state.insideBracket = true
        state.closedBracket = false
      } else {
        if (exists(state.keyStart)) {
          // state: dot key continue
          if (!/^[A-Za-z0-9_$]$/.test(character)) throw new Error(parseErrorMessage(state, 'invalid dot key'))
        } else {
          // state: dot key start
          state.keyStart = i
          if (!/^[A-Za-z_$]$/.test(character)) throw new Error(parseErrorMessage(state, 'invalid dot key'))
        }
      }
    }
    return state
  }
  return state.ctx
}

function handleKey (operation, key, state, opts) {
  debug(handleKey, key)
  var nextCtx = operation(state.ctx, key, state, opts)
  state.parentCtx = state.ctx
  state.ctx = nextCtx
  state.keyStart = null
  state.keyEnd = null
  state.keypathSplit.push(key)
  debug('NEXT %O', {
    parentCtx: state.parentCtx,
    ctx: state.ctx,
    keyStart: state.keyStart,
    keyEnd: state.keyEnd,
    keypathSplit: state.keypathSplit,
  })
}

function parseErrorMessage (state, extra) {
  debug('parseErrorMessage %O %s', state, extra)
  return [
    "Error parsing keypath '", state.keypath, "' ",
    'at char ', (state.i + 1), " '", state.character, "'",
    ': ', extra
  ].join('')
}