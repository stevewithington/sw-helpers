const getFileDetails = require('./utils/get-file-details');
const filterFiles = require('./utils/filter-files');
const errors = require('./errors');

/**
 * To get a list of files and revision details that can be used to ultimately
 * precache assets in a service worker.
 *
 * @param {Object} input
 * @param {Array<String>} input.globPatterns  Patterns used to select files to
 * include in the file entries.
 * @param {Array<String>} input.globIgnores  Patterns used to exclude files
 * from the file entries.
 * @param {String} input.rootDirectory The directory run the glob patterns over.
 * @return {Array<Object>} An array of ManifestEntries will include
 * a url and revision details for each file found.
 */
module.exports = (input) => {
  if (!input || typeof input !== 'object' || input instanceof Array) {
    throw new Error(errors['invalid-get-manifest-entries-input']);
  }

  const globPatterns = input.globPatterns;
  const globIgnores = input.globIgnores;
  const rootDirectory = input.rootDirectory;

  if (typeof rootDirectory !== 'string' || rootDirectory.length === 0) {
    return Promise.reject(
      new Error(errors['invalid-root-directory']));
  }

  const fileSet = new Set();

  const fileDetails = globPatterns.reduce((accumulated, globPattern) => {
    const globbedFileDetails = getFileDetails(
      rootDirectory, globPattern, globIgnores);
    globbedFileDetails.forEach((fileDetails) => {
      if (fileSet.has(fileDetails.file)) {
        return;
      }

      fileSet.add(fileDetails.file);
      accumulated.push(fileDetails);
    });
    return accumulated;
  }, []);

  return filterFiles(fileDetails);
};
