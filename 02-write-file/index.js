const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const fileName = '02-write-file.txt';
const startMsg = 'Hello. Enter text >';
const endMsg = 'Goodbye.';

stdout.write(startMsg);
stdin.on('data', (data) => {
  if (data.toString() !== '\r\n') {
    if (data.toString() !== 'exit\r\n') {
      console.log('working wrong');
      fs.writeFile(path.resolve(__dirname, fileName), data, (err) => {
        if (err) {
          stdout.write(err + '\n');
          process.exit(-1);
        } else {
          stdout.write('File written successfully\n');
          process.exit(0);
        }
      });
    } else {
      stdout.write('Exit\n');
      process.exit(0);
    }
  } else {
    process.exit(64);
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
