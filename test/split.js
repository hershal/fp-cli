const assert = require('chai').assert;
const _ = require('lodash');
const exec = require('child_process').execSync;

const split = require('../split');

describe('split tests', function () {
  it('should split a simple string', function () {
    const input = 'hello friendly world';
    const output = 'hello\nfriendly\nworld';
    const splitted = split(input);
    ensure(splitted, output);
  });

  it('should split a more complicated string', function () {
    const input = 'hello:this:is:dog';
    const output = 'hello dog';
    const splitted = split(input, {inputDelimeter: ':', outputDelimeter: ' ', fields: '0,3'});
    ensure(splitted, output);
  });

  it('should be invokable from the shell', function () {
    const input = 'one.,two.,three.,four';
    const output = 'one four';
    const splitted = exec(`echo "${input}" | ./split.js -i ., -f0,3`).toString().trim();
    ensure(splitted, output);
  });
});

function ensure(splitted, output) {
  assert (splitted === output,
          `split: ${splitted} != out: ${output}`);
}
