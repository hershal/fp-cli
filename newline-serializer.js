class NewlineSerializer {
  constructor() {
    // data left over from any previous data chunk
    this.buffer = '';
  }

  serialize(rawData, callback) {
    let data = rawData.toString().split('\n');

    if (data.length > 0) {
      // prepend the leftover buffer contents to the first datum
      data[0] = this.buffer + data[0];

      // chop out the leftover data
      this.buffer = data.pop();

      for (const idx in data) {
        callback(data[idx]);
      }
    }
  }

  flush(callback) {
    if (this.buffer.length == 0 || this.buffer.indexOf('\n') == 0) {
      // do nothing
      return;
    }
    callback(this.buffer);
    this.buffer = '';
  }
}

module.exports = NewlineSerializer;
