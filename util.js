module.exports.defined = defined;
function defined(arg) {
  return (typeof arg != 'undefined');
}

module.exports.select = select;
function select(value1, value2, predicatefn) {
  if (predicatefn()) {
    return value1;
  }
  return value2;
}

module.exports.decode = decode;
function decode(input, defaultValue) {
  if (defined(input)) {
    return input;
  }
  return defaultValue;
}
