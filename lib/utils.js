var
  XXHash = require('xxhash'),
  seed = 1 // Seed doesn't matter because we aren't using the hash cryptographically
;

exports.utils = function(grunt, options) {
  return {

    getHash: function(file) {
      return XXHash.hash(grunt.file.read(file, {
        encoding: null
      }), seed);
    },

    getCache: function(file) {
      var cacheFile = getCacheFile(file);
      if(grunt.file.exists(cacheFile)) {
        return grunt.file.read(cacheFile);
      } else {
        return 0;
      }
    },

    writeCache: function(file, time) {
      grunt.file.write(getCacheFile(file), time);
    },

    getCacheFile: function(file) {
      return path.join(__dirname,'..',options.cacheDir,path.relative(options.baseDir, file + '.cache'));
    },

    parseBase: function(filepath) {
      return path.join(options.baseDir, filepath);
    },

    checkFile: function (filepath) {
      if (getHash(filepath) != getCache(filepath)) {
        grunt.log.writeln('File ' + filepath.cyan + ' updated. Processing...');
        return true;
      }
      grunt.log.debug(filepath + ' has not been updated.');
      return false;
    },

    escapeRegex: function(s) {
      return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
  };
};