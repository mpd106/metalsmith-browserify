var browserify = require('browserify');
var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');

var removeClashingSourceFiles = function(files, metalsmithDestinationPath, destinationFilePath) {
  var check = function(fileInDestinationPath, destinationFilePath) {
    return fileInDestinationPath === destinationFilePath;
  };
  removeMatchingFiles(files, metalsmithDestinationPath, destinationFilePath, check);
};

var removeOtherJsFiles = function(files, metalsmithDestinationPath, destinationFilePath) {
  var check = function(fileInDestinationPath, destinationFilePath) {
    return fileInDestinationPath !== destinationFilePath;
  };
  removeMatchingFiles(files, metalsmithDestinationPath, destinationFilePath, check);
};

var removeMatchingFiles = function(files, metalsmithDestinationPath, destinationFilePath, check) {
  var fileNames = Object.keys(files);
  var matchingFileNames  = fileNames.filter(function(fileName) {
    var fileInDestinationPath = path.join(metalsmithDestinationPath, fileName);
    return check(fileInDestinationPath, destinationFilePath);
  });
  matchingFileNames.forEach(function(fileName) {
    delete files[fileName];
  });
};

/**
 * Metalsmith plugin to browserify specified JS files
 *
 * @param {Object} options
 *   @property {Array} files
 *   @property {String} dest
 *   @property {Boolean} excludeOtherSources
 *   @property {Boolean} emitSourceMap
 */
module.exports = function(opts) {
  if (!opts.files) throw new Error("'files' option required");
  if (!opts.dest) throw new Error("'dest' option required");
  if (!opts.emitSourceMap) opts.emitSourceMap = false;

  return function(files, metalsmith, done) {
    var sourceFileNames = opts.files.map(function(file) {
      return path.join(metalsmith.source(), file);
    });
    var destinationFileName = opts.dest;

    // todo: use async or something to reduce nesting
    var b = browserify(sourceFileNames ,{ debug: opts.emitSourceMap });
    b.bundle(function(err, buffer) {
      if (err) return done(err);

      // todo: extract
      var metalsmithDestinationPath = metalsmith.destination();
      var destinationFilePath = path.join(metalsmithDestinationPath, destinationFileName);
      var destinationFolder = path.dirname(destinationFilePath);
      mkdirp(destinationFolder, function(err) {
        if (err) return done(err);

        fs.writeFile(destinationFilePath, buffer, function(err) {
          if (err) return done(err);
          removeClashingSourceFiles(files, metalsmithDestinationPath, destinationFilePath);
          if (opts.excludeOtherSources) {
            removeOtherJsFiles(files, metalsmithDestinationPath, destinationFilePath);
          }
          done();
        });
      });
    });
  };
};

