const fs = require('fs');
const path = require('path');
const options = {
  styles: 'styles',
  components: 'components',
  assets: 'assets',
  cssDestFile: 'style.css',
  cssFilter: '^.+.css$',
  destFolder: 'project-dist',
  destFile: 'index.html',
  templateFile: 'template.html',
};

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

const createFolder = async (pathToFolder, folderName) => {
  return fs.promises.mkdir(path.resolve(pathToFolder, folderName), {
    recursive: true,
  });
};

const copyDirRecursive = async (src, dest) => {
  const dir = await fs.promises.readdir(src, {
    withFileTypes: true,
  });

  await fs.promises.mkdir(dest, {
    recursive: true,
  });

  for await (const dirent of dir) {
    if (dirent.isFile()) {
      await fs.promises.copyFile(
        path.resolve(src, dirent.name),
        path.resolve(dest, dirent.name),
      );
    } else {
      copyDirRecursive(
        path.resolve(src, dirent.name),
        path.resolve(dest, dirent.name),
      );
    }
  }
};

const mergeFiles = async (src, dest, fileName, fileTemplate) => {
  let isHasFile = false;
  try {
    await hasFile(path.resolve(__dirname, dest, fileName));
    isHasFile = true;
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.log(err);
    }
  }

  if (isHasFile) {
    await fs.promises.writeFile(path.resolve(__dirname, dest, fileName), '', {
      encoding: 'utf-8',
    });
  }

  const dir = await fs.promises.opendir(path.resolve(__dirname, src), {
    withFileTypes: true,
  });

  for await (const dirent of dir) {
    if (dirent.isFile() && dirent.name.match(fileTemplate)) {
      let temp = await readFile(path.resolve(__dirname, src, dirent.name));
      temp += '\n';
      await writeFile(temp, path.resolve(__dirname, dest, fileName));
    }
  }
};

const renderFile = async (src, dest, fileName, fileTemplate) => {
  const dir = await fs.promises.opendir(src, {
    withFileTypes: true,
  });

  let index = await readFile(fileTemplate);

  for await (const dirent of dir) {
    const component = await readFile(path.resolve(src, dirent.name));
    index = index.replace(
      `{{${dirent.name.split('.')[0]}}}`,
      `\n${component}\n`,
    );
  }

  await fs.promises.writeFile(path.resolve(dest, fileName), index, {
    encoding: 'utf-8',
  });
};

(async () => {
  await createFolder(__dirname, options.destFolder);

  await renderFile(
    path.resolve(__dirname, options.components),
    path.resolve(__dirname, options.destFolder),
    options.destFile,
    path.resolve(__dirname, options.templateFile),
  );

  await mergeFiles(
    path.resolve(__dirname, options.styles),
    path.resolve(__dirname, options.destFolder),
    options.cssDestFile,
    options.cssFilter,
  );

  await copyDirRecursive(
    path.resolve(__dirname, options.assets),
    path.resolve(__dirname, options.destFolder, options.assets),
  );
})();
