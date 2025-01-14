const { Transform } = require('node:stream');
const { join } = require('node:path');
const { createReadStream, createWriteStream } = require('node:fs');

// input file has 3kb
const inputFilePath = join(__dirname, '..', 'data', 'lorem-input.txt');
const outputFilePath = join(__dirname, '..', 'data', 'lorem-output.txt');

// { highWaterMark: 1024 } read stream chunk size 1kb
// default chunk size is 64 kb
const fileInputStream = createReadStream(inputFilePath, {
  highWaterMark: 1024, // 1 kb
});

const fileOutputStream = createWriteStream(outputFilePath);

const toUppercaseTransformStream = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    setTimeout(callback, 1000); // to see chunk being proccesed
    // callback(); // chunk proccesing is finished
  },
});

// readStream.pipe(writeStream) returns a readStream

fileInputStream.pipe(toUppercaseTransformStream).pipe(process.stdout);
// inputStream.pipe(toUppercaseTransformStream).pipe(fileOutputStream);
