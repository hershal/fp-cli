#!/usr/bin/env node

const _ = require('lodash');
const readline = require('readline');

const args = require('./parser')();
const util = require('./util');

function main() {
  const options = decodeOptions(args);

  const rl = readline.createInterface({
    input: process.stdin
  });

  rl.on('line', (line) => {
    console.log(
      processLine(line, options));
  });
}

function normalizeOptions(args) {
  return {
    t: args['trim'],
    f: args['fields'],
    i: args['inputDelimeter'],
    o: args['outpuDelimeter']
  };
}

function decodeOptions(rawArgs) {
  const args = _.merge(normalizeOptions(rawArgs), rawArgs);
  const fields = util.defined(args.f) ? _.split(args.f, ',') : undefined;
  const inputDelimeter = util.decode(args.i, ' ');
  const outputDelimeter = util.decode(
    args.o, util.select(' ', '\n', util.defined(args.f)));

  return { fields, inputDelimeter, outputDelimeter };
}

function processLine(line, options) {
  const processed = _.split(line, options.inputDelimeter);
  // if you're asking for a specific field, then return that
  if (util.defined(options.fields)) {
    return _(options.fields).map((num) => processed[num]).join(options.outputDelimeter);
  }
  return _.join(processed, options.outputDelimeter);
}

module.exports = api;
function api(input, args) {
  if (typeof input == 'string') {
    input = _.split(input, '\n');
  }

  // to avoid the 'not defined' exception
  if (!util.defined(args)) {
    args = {};
  }

  const options = decodeOptions(args);
  return _(input)
    .map((line) => processLine(line, options))
    .join('\n');
}

main();
