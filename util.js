module.exports.defined = defined;
function defined(arg) {
  return (typeof arg != 'undefined');
}

module.exports.select = select;
function select(valueTrue, valueFalse, predicate) {
  if (predicate) {
    return valueTrue;
  }
  return valueFalse;
}

module.exports.decode = decode;
function decode(input, defaultValue) {
  if (defined(input)) {
    return input;
  }
  return defaultValue;
}
