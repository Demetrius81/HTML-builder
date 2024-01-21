const fs = require('fs');
const path = require('path');
const { stdout } = process;
const fileName = 'text.txt';

const stream = fs.ReadStream(path.resolve(__dirname, fileName), {
  encoding: 'utf-8',
});

stream.on('readable', () => {
  const data = stream.read();
  if (data) {
    stdout.write(data);
  } else {
    stdout.write('\n');
  }
});

stream.on('error', (err) =>
  stdout.write(err.code === 'ENOENT' ? 'File not found' : err),
);
