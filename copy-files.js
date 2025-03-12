const core = require('@actions/core');
const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');

async function fileExists(filePath) {
  try {
      await fs.access(filePath);
      return true;
  } catch {
      return false;
  }
}

async function run() {
  try {
    let sourceFolder = core.getInput('source-folder');
    const contents = core.getInput('contents');
    let targetFolder = core.getInput('target-folder');
    const clearTargetFolder = core.getBooleanInput('clear-target-folder');
    const overwrite = core.getBooleanInput('overwrite');

    // Normalize paths to avoid issues with drive letters (Windows)
    sourceFolder = path.resolve(sourceFolder);
    targetFolder = path.resolve(targetFolder);

    // Clear target folder if required
    if (clearTargetFolder) {
      await fs.rm(targetFolder, { recursive: true, force: true });
    }
    
    // Ensure target folder exists
    await fs.mkdir(targetFolder, { recursive: true });
    
    // Find files matching the pattern
    let files = glob.sync(contents, { cwd: sourceFolder, absolute: true });
    
    let hasError = false;
    await Promise.all(files.map(async file => {
        const relativePath = path.relative(sourceFolder, file);
        const targetPath = path.join(targetFolder, relativePath);
        
        try {
          // Ensure target subdirectory exists
          await fs.mkdir(path.dirname(targetPath), { recursive: true });
          
          if ((await fileExists(targetPath)) && !overwrite) {
            core.warning(`⚠️ File ${targetPath} already exists and will not be overwritten.`);
            return;
          }

          await fs.copyFile(file, targetPath);

          core.info(`✅ Copied ${file} to ${targetPath}`);
        } catch (err) {
          core.error(`❌ Error copying ${file} to ${targetPath}`);
          hasError = hasError || true;
        }
    }));

    if(hasError) {
      core.setFailed('Error copying files');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();