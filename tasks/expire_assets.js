/*
 * grunt-expire-images
 * https://github.com/Respage/grunt-expire-images
 *
 * Copyright (c) 2014 David Roda
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
  path = require('path')

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('expire_assets', '', function () {
    // Merge task-specific and/or target-specific options with these defaults.

    var options = this.options({
        baseDir: './',
        cacheDir: '.cache'
      }),
      utils = require('../lib/utils').utils(grunt, options)

    // Iterate over all specified file groups.
    this.files.forEach(
      function (f) {
        console.log(f.src);
        var src = f.src
          .map(utils.parseBase)
          .filter(utils.checkFile)
          .map(function (filepath) {
            var
              relPath = path.relative(options.basedir, filepath).replace(/\\/g, "/"),
              hash = utils.getCache(filepath)
              ;
            return {path: relPath, hash: hash};
          });
        if (src.length > 0) {
          var dest = grunt.file.expand(f.dest);
          dest.forEach(function (file) {
            var content = grunt.file.read(file);
            src.forEach(function (asset) {
              var assetReg = new RegExp(utils.escapeRegex(asset.path) + "\\??[0-9]*", "mg");
              content = content.replace(assetReg, asset.path + "?" + asset.hash);
            });
            grunt.file.write(file, content);
          });
        }
      });
  });

};