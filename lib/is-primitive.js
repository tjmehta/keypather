module.exports = function isPrimitive (obj) {
  return (
    typeof obj === 'undefined' ||
    typeof obj === 'boolean' ||
    typeof obj === 'number' ||
    typeof obj === 'string'
  )
}
