#!/usr/bin/env node

const _ = require('lodash');
const cliTable = require('cli-table2');

const args = require('./parser')();
const util = require('./util');

const NewlineSerializer = require('./newline-serializer');

class CLITable extends cliTable {
  constructor() {
    super(
      {head: '', chars:
       {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''}
      });

    // dictionary maps row length to row index
    this.rowLengths = {};
  }

  push(row) {
    const index = this.length;
    super.push(row);
    if (typeof this.rowLengths[row.length] == "undefined") {
      this.rowLengths[row.length] = [index];
    } else {
      this.rowLengths[row.length].push(index);
    }
  }

  normalize() {
    const lengths = Object.keys(this.rowLengths);
    const max = Math.max(...lengths);

    for (const length of lengths) {
      if (length == max) { continue; }
      for (const rowIndex of this.rowLengths[length]) {
        while (this[rowIndex].length < max) {
          this[rowIndex].push('');
        }
      }
    }
  }
}

function main() {
  const options = util.decodeOptions(args);
  const serializer = new NewlineSerializer();
  let table = new CLITable();

  process.stdin.on('data', (data) => {
    serializer.serialize(data, (line) => {
      processLine(line, table, options);
    });
  });

  process.stdin.on('close', () => {
    serializer.flush((line) => {
      processLine(line, table, options);
    });
    table.normalize();
    console.log(table.toString());
  });
}

function processLine(line, table, options) {
  let processed = util.preprocess(line, options);
  const tableEntry = processed.split(options.inputDelimeter);
  table.push(tableEntry);
}

main();
