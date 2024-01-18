const fs = require('fs');
const path = require('path');
const fileName = 'bundle.css';
const srcFolder = 'styles';
const destFolder = 'project-dist';
const regexp = '^.+.css$';

const writeFile = async (data, pathFile) => {
  fs.promises.appendFile(pathFile, data, { encoding: 'utf-8' });
};

const readFile = async (pathFile) => {
  return fs.promises.readFile(pathFile, {
    encoding: 'utf-8',
  });
};

const hasFile = async (pathFile) => {
  return fs.promises.access(pathFile, fs.constants.F_OK);
};

(async () => {
  let isHasFile = false;
  try {
    await hasFile(path.resolve(__dirname, destFolder, fileName));
    isHasFile = true;
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.log(err);
    }
  }

  if (isHasFile) {
    await fs.promises.writeFile(
      path.resolve(__dirname, destFolder, fileName),
      '',
      {
        encoding: 'utf-8',
      },
    );
  }

  const dir = await fs.promises.opendir(path.resolve(__dirname, srcFolder), {
    withFileTypes: true,
  });

  for await (const dirent of dir) {
    if (dirent.isFile() && dirent.name.match(regexp)) {
      let temp = await readFile(
        path.resolve(__dirname, srcFolder, dirent.name),
      );
      temp += '\n';
      await writeFile(temp, path.resolve(__dirname, destFolder, fileName));
    }
  }
})();
