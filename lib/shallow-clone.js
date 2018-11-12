module.exports = function shallowClone (obj) {
  return Array.isArray(obj)
    ? obj.slice()
    : Object.assign({}, obj)
}
