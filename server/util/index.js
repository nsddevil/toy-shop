const fs = require('fs').promises;

const deleteFile = async (files) => {
  if (!files) throw new Error('no files');
  try {
    if (Array.isArray(files)) {
      return await Promise.all(
        files.map(async (file) => await fs.unlink(file))
      );
    }
    return await fs.unlink(files);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  deleteFile,
};
