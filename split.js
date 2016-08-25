#!/usr/bin/env node

const _ = require('lodash');
const args = require('./parser')();
const readline = require('readline');
const util = require('./util');

function main() {
  const options = decodeOptions(args);

  const rl = readline.createInterface({
    input: process.stdin
  });

  rl.on('line', (line) => {
    console.log(
      processLine(line, options.inputDelimeter,
                  options.outputDelimeter, options.fields));
  });
}

function decodeOptions(args) {
  const fields = _.split(util.decode(args.f, undefined), ',');
  const inputDelimeter = util.decode(args.d, ' ');
  const outputDelimeter = util.decode(
    args.o, util.select('\n', ' ', typeof fields == 'undefined'));

  return { fields, inputDelimeter, outputDelimeter };
}

function processLine(line, inputDelimeter, outputDelimeter, fields) {
  const processed = _.split(line, inputDelimeter);

  // if you're asking for a specific field, then return that
  if (util.defined(fields)) {
    return _(fields).map((num) => processed[num]).join(outputDelimeter);
  }
  return _.join(processed, outputDelimeter);
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
    .map((line) => processLine(line, options.inputDelimeter,
                               options.outputDelimeter, options.fields))
    .join('\n');
}

main();
