const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const fileName = '02-write-file.txt';
const startMsg = 'Hello. Enter text >';
const endMsg = 'Goodbye.';

stdout.write(startMsg);
fs.writeFile(path.resolve(__dirname, fileName), '', (err) => {
  if (err) {
    process.exit(err.code);
  }
});
stdin.on('data', (data) => {
  if (data.toString() !== 'exit\r\n') {
    fs.appendFile(path.resolve(__dirname, fileName), data, (err) => {
      if (err) {
        stdout.write(err + '\n');
        process.exit(-1);
      }
    });
  } else {
    stdout.write('Exit\n');
    process.exit(0);
  }
});
process.on('exit', (code) => {
  if (code === 0) {
    stdout.write(endMsg + '\n');
  } else if (code === 64) {
    stdout.write('No data entered');
    stdout.write(endMsg + '\n');
  } else if (code === 128) {
    stdout.write('Ctrl + C were pressed. Exiting script...');
  } else {
    stdout.write(`Semething wrong. The program exited with code ${code}\n`);
  }
});
process.on('SIGINT', () => {
  process.exit(128);
});
