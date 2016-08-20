const parser = require('minimist');
const util = require('./util');

/* This is a shim to make the code look cleaner in the other files. */
function parse(argv) {
  return parser(util.decode(argv, process.argv));
}

module.exports = parse;
