const _ = require('lodash');

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

module.exports.normalizeOptions = normalizeOptions;
function normalizeOptions(args) {
  return {
    t: args['trim'],
    f: args['fields'],
    i: args['inputDelimeter'],
    o: args['outpuDelimeter']
  };
}

module.exports.decodeOptions = decodeOptions;
function decodeOptions(rawArgs) {
  const args = _.merge(normalizeOptions(rawArgs), rawArgs);
  const fields = defined(args.f) ? _.split(args.f, ',') : undefined;
  const inputDelimeter = decode(args.i, ' ');
  const trim = decode(args.t, true);
  const outputDelimeter = decode(
    args.o, select(' ', '\n', defined(args.f)));

  return { trim, fields, inputDelimeter, outputDelimeter };
}

module.exports.preprocess = preprocess;
function preprocess(rawLine, options) {
  let line = rawLine.toString();
  if (options.trim) {
    line = line.replace(/\s+/g, ' ').trim();
  }
  return line;
}
