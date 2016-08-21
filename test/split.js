const assert = require('chai').assert;
const _ = require('lodash');

const split = require('../split');

describe('split tests', function () {
  it('should split a simple string', function () {
    const input = 'hello friendly world';
    const output = 'hello\nfriendly\nworld';

    const splitted = split(input);
    assert(splitted === output,
           `split: ${splitted} != out: ${output}`);
  });
});
