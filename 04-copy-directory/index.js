const fs = require('fs');
const path = require('path');
const { stderr } = process;
const folderName = 'files';
const folderSuffix = '-copy';

(async () => {
  try {
    const destFolder = await fs.promises.mkdir(
      path.resolve(__dirname, folderName + folderSuffix),
      {
        recursive: true,
      },
    );

    if (!destFolder) {
      const dirNew = await fs.promises.opendir(
        path.resolve(__dirname, folderName + folderSuffix),
        {
          withFileTypes: true,
        },
      );
      for await (const dirent of dirNew) {
        if (dirent.isFile()) {
          fs.rm(
            path.resolve(__dirname, folderName + folderSuffix, dirent.name),
            (e) => {
              if (e) {
                stderr.write(e);
              }
            },
          );
        }
      }
    }

    const dir = await fs.promises.opendir(path.resolve(__dirname, folderName), {
      withFileTypes: true,
    });
    for await (const dirent of dir) {
      if (dirent.isFile()) {
        await fs.promises.copyFile(
          path.resolve(__dirname, folderName, dirent.name),
          path.resolve(__dirname, folderName + folderSuffix, dirent.name),
          0,
        );
      }
    }
  } catch (err) {
    stderr.write(err);
  }
})();
