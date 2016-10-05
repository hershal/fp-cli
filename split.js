#!/usr/bin/env node

const _ = require('lodash');
const readline = require('readline');

const args = require('./parser')();
const util = require('./util');

const NewlineSerializer = require('./newline-serializer');

function main() {
  const options = util.decodeOptions(args);
  const serializer = new NewlineSerializer();

  process.stdin.on('data', (data) => {
    serializer.serialize(data, (line) => {
      console.log(processLine(line, options));
    });
  });

  process.stdin.on('close', () => {
    serializer.flush('', (line) => {
      console.log(processLine(line, options));
    });
  });

  process.stdout.on('error', (err) => {
    if (err.code == 'EPIPE') {
      process.exit(0);
    }
  });
}

function processLine(line, options) {
  let processed = util.preprocess(line, options);

  // do the split
  let inputDelim = util.decode(options.inputRegex, options.inputDelimeter);
  processed = _.split(processed, inputDelim);

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

  const options = util.decodeOptions(args);
  return _(input)
    .map((line) => processLine(line, options))
    .join('\n');
}

main();
