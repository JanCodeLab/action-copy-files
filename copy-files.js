const core = require('@actions/core');
const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');

async function run() {
  try {
    const sourceFolder = core.getInput('source-folder');
    const contents = core.getInput('contents');
    const targetFolder = core.getInput('target-folder');
    const cleanTargetFolder = core.getBooleanInput('clean-target-folder');
    const overwrite = core.getBooleanInput('overwrite');

    //create target folder only if it does not exist
    if (!await fs.stat(targetFolder).catch(() => false)) {
      await fs.mkdir(targetFolder, { recursive: true });
    }

    if (cleanTargetFolder) {
      await fs.rmdir(targetFolder, { recursive: true });
      await fs.mkdir(targetFolder, { recursive: true });
    }

    const files = glob.sync(path.join(sourceFolder, contents));
    for (const file of files) {
      const targetPath = path.join(targetFolder, path.relative(sourceFolder, file));
      if (!overwrite && await fs.stat(targetPath).catch(() => false)) {
        core.warning(`⚠️ File ${targetPath} already exists and will not be overwritten.`);
        continue;
      }
      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.copyFile(file, targetPath);
      core.info(`✅ Copied ${file} to ${targetPath}`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
