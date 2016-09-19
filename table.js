#!/usr/bin/env node

const _ = require('lodash');
const cliTable = require('cli-table2');

const args = require('./parser')();
const util = require('./util');

const NewlineSerializer = require('./newline-serializer');

function main() {
  const options = util.decodeOptions(args);
  const serializer = new NewlineSerializer();

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
  let processed = util.preprocess(line, options);
  const tableEntry = processed.split(options.inputDelimeter);
  table.push(tableEntry);
}

main();
