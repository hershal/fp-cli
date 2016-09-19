#!/usr/bin/env node

const _ = require('lodash');
const cliTable = require('cli-table2');

const args = require('./parser')();
const util = require('./util');

const NewlineSerializer = require('./newline-serializer');

function main() {
  const options = decodeOptions(args);
  let serializer = new NewlineSerializer();

  let table = new cliTable(
    {head: '', chars:
     {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''}
    });

  process.stdin.on('data', (data) => {
    serializer.serialize(data, (line) => {
      processLine(line, table, options);
    });
  });

  process.stdin.on('close', () => {
    serializer.flush((line) => {
      processLine(line, table, options);
    });
    console.log(table.toString());
  });
}

function processLine(line, table, options) {
  let processed = line;

  if (options.trim) {
    processed = processed.replace(/\s+/, ' ').trim();
  }

  const tableEntry = processed.split(options.inputDelimeter);
  table.push(tableEntry);
}

function decodeOptions(rawArgs) {
  const args = _.merge(normalizeOptions(rawArgs), rawArgs);
  const fields = util.defined(args.f) ? _.split(args.f, ',') : undefined;
  const inputDelimeter = util.decode(args.i, ' ');
  const trim = util.decode(args.t, true);

  return { trim, fields, inputDelimeter };
}

function normalizeOptions(args) {
  return {
    t: args['trim'],
    f: args['fields'],
    i: args['inputDelimeter']
  };
}

main();
