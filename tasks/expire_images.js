/*
 * grunt-expire-images
 * https://github.com/Respage/grunt-expire-images
 *
 * Copyright (c) 2014 David Roda
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
    XXHash = require('xxhash'),
    path = require('path'),
    seed = 1; // Seed doesn't matter because we aren't using the hash cryptographically

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('expire_images', 'The best Grunt plugin ever.', function () {

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            basedir: 'app/webroot/'
        });


        var getHash = function(file) {
            return XXHash.hash(grunt.file.read(file, {
                encoding: null
            }), seed);
        };

        var getCache = function(file) {
            var cacheFile = getCacheFile(file);
            if(grunt.file.exists(cacheFile)) {
                return grunt.file.read(cacheFile);
            } else {
                return 0;
            }
        };

        var writeCache = function(file, time) {
            grunt.file.write(getCacheFile(file), time);
        };

        var getCacheFile = function(file) {
            return path.join(__dirname,'..','.cache',path.relative(options.basedir, file + '.cache'));
        };

        var checkFile = function (filepath) {
            if (getHash(filepath) != getCache(filepath)) {
                grunt.log.writeln('File ' + filepath.cyan + ' updated. Processing...');
                return true;
            }
            grunt.log.debug(filepath + ' has not been updated.');
            return false;
        };

        var escapeRegex = function(s) {
            return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        };

        // Iterate over all specified file groups.
        this.files.forEach(function (f) {
            var src = f.src.filter(checkFile).map(function (filepath) {
                var relPath = path.relative(options.basedir,filepath).replace(/\\/g,"/"),
                    hash = getHash(filepath);
                writeCache(filepath, hash);
                return {path: relPath, hash: hash};
            });
            if(src.length > 0) {
                var dest = grunt.file.expand(f.dest);
                dest.forEach(function(file) {
                    var content = grunt.file.read(file);
                    src.forEach(function(asset) {
                        var assetReg = new RegExp(escapeRegex(asset.path) + "\\??[0-9]*","mg");
                        content = content.replace(assetReg, asset.path + "?" + asset.hash);
                    });
                    grunt.file.write(file, content);
                });
            }
        });
    });

};
