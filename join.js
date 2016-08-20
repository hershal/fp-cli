#!/usr/bin/env node

const _ = require('lodash');
const args = require('./parser')();

let delimeter = ' ';

if (typeof args.d != 'undefined') {
  delimeter = args.d;
}

console.log(_.join(args._, delimeter));
