#!/usr/bin/env node

const _ = require('lodash');
const readline = require('readline');

const args = require('./parser')();
const util = require('./util');

const NewlineSerializer = require('./newline-serializer');

function main() {
  const options = decodeOptions(args);

  let serializer = new NewlineSerializer();

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
  const trim = util.decode(args.t, true);
  const outputDelimeter = util.decode(
    args.o, util.select(' ', '\n', util.defined(args.f)));

  return { trim, fields, inputDelimeter, outputDelimeter };
}

function processLine(line, options) {
  let processed = line.toString();

  // trim if asked for
  if (options.trim) {
    processed = processed.replace(/\s+/g, ' ').trim();
  }

  // do the split
  processed = _.split(processed, options.inputDelimeter);

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
