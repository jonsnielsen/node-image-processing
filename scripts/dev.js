const fs = require('fs-extra');
const chokidar = require('chokidar');
const rimraf = require('rimraf');
const { DESTINATION_DIRECTORY } = require('./dev.env');

const WATCH_GLOB = './dist/**/*';
const SOURCE_DIRECTORY = 'dist/';

rimraf.sync(DESTINATION_DIRECTORY);

const log = (a, b, g) => {
  if (g) console.group(g);

  console.dir(` in: ${a}`);
  console.dir(`out: ${b}`);

  if (g) console.groupEnd();
};

const copy = p => {
  const d = p.replace(SOURCE_DIRECTORY, DESTINATION_DIRECTORY);

  fs.copy(p, d, { overwrite: true }, e => {
    if (e) return console.error(e);

    log(p, d, 'copy');
  });
};

const remove = p => {
  const d = p.replace(SOURCE_DIRECTORY, DESTINATION_DIRECTORY);

  fs.remove(d, e => {
    if (e) return console.error(e);

    log(p, d, 'remove');
  });
};

console.info(`Watching ${WATCH_GLOB} for changes...`);

chokidar
  .watch(WATCH_GLOB)
  .on('change', copy)
  .on('add', copy)
  .on('unlink', remove)
  .on('unlinkDir', remove)
  .on('error', () => console.error(error));
