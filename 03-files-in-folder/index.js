const fs = require('fs');
const path = require('path');
const { stdout } = process;
const folderName = 'secret-folder';

(async () => {
  try {
    const dir = await fs.promises.opendir(path.resolve(__dirname, folderName), {
      withFileTypes: true,
    });

    for await (const dirent of dir) {
      if (dirent.isFile()) {
        fs.stat(
          path.resolve(__dirname, folderName, dirent.name),
          (error, stats) => {
            if (error) {
              stdout.write(error);
            } else {
              dirent.name.split('.').forEach((x) => stdout.write(`${x} - `));
              stdout.write(`${stats.size / 1000} kb\n`);
            }
          },
        );
      }
    }
  } catch (err) {
    stdout.write(err);
  }
})();
