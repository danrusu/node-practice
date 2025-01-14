const { Transform } = require('node:stream');
const zlib = require('node:zlib');
const { join } = require('node:path');
const { createReadStream, createWriteStream } = require('node:fs');

// input file has 3kb
const inputFilePath = join(__dirname, '..', 'data', 'lorem-input.txt');
const outputFilePath = join(__dirname, '..', 'data', 'lorem-output.txt');
const gzipFilePath = join(__dirname, '..', 'data', 'lorem-output.gzip');

// { highWaterMark: 1024 } read stream chunk size 1kb
// default chunk size is 64 kb
const fileInputStream = createReadStream(inputFilePath, {
  highWaterMark: 1024, // 1 kb
});

// output (write) streams
const fileOutputStream = createWriteStream(outputFilePath);
const gzipOutputStream = createWriteStream(gzipFilePath);

// transform streams
const toUppercaseTransformStream = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    // setTimeout(callback, 1000); // to see chunk being proccesed when output is stdout
    callback(); // chunk proccesing is finished
  },
});
const gzipTransformStream = zlib.createGzip();

// TIP: readStream.pipe(writeStream) returns a readStream

// fileInputStream.pipe(toUppercaseTransformStream).pipe(process.stdout);

// fileInputStream.pipe(toUppercaseTransformStream).pipe(fileOutputStream);

fileInputStream
  .pipe(toUppercaseTransformStream)
  .pipe(gzipTransformStream)
  .pipe(gzipOutputStream);
