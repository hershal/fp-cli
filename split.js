#!/usr/bin/env node

const _ = require('lodash');
const args = require('./parser')();
const readline = require('readline');
const util = require('./util');

let inputDelimeter = util.decode(args.d, ' ');
let outputDelimeter = util.decode(args.o, '\n');
let field = util.decode(args.f, undefined);

const rl = readline.createInterface({
  input: process.stdin
});

rl.on('line', (line) => {
  console.log(processLine(line));
});

function processLine(line) {
  const processed = _.split(line, inputDelimeter);

  // if you're asking for a specific field, then return that
  if (util.defined(field)) {
    return processed[field];
  }
  return _.join(processed, outputDelimeter);
}
