#!/usr/bin/env node

const _ = require('lodash');
const args = require('./parser')();
const readline = require('readline');
const util = require('./util');

const inputDelimeter = util.decode(args.d, ' ');
const fields = _.split(util.decode(args.f, undefined), ',');
const outputDelimeter = util.decode(
  args.o, util.select('\n', ' ', typeof fields == 'undefined'));

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (line) => {
  console.log(processLine(line, inputDelimeter, outputDelimeter, fields));
});

function processLine(line, inputDelimeter, outputDelimeter, fields) {
  const processed = _.split(line, inputDelimeter);
  // if you're asking for a specific field, then return that
  if (util.defined(fields)) {
    return _(fields).map((num) => processed[num]).join(outputDelimeter);
  }
  return _.join(processed, outputDelimeter);
}

function api(input, args) {
  if (typeof input == 'string') {
    input = _.split(input, '\n');
  }

  // to avoid the 'not defined' exception
  if (!util.defined(args)) {
    args = {};
  }

  const inputDelimeter = util.decode(args.inputDelimeter, ' ');    // string
  const outputDelimeter = util.decode(args.outputDelimeter, '\n'); // string
  const fields = util.decode(args.f, undefined); // array

  return _(input)
    .map((line) => processLine(line, inputDelimeter, outputDelimeter, fields))
    .join('\n');
}
module.exports = api;
