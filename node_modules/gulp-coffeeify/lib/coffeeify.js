(function() {
  var PluginError, RED, RESET, _, aliasMap, browserify, coffee, convert, fs, glob, gutil, path, replaceExtension, through2, traceError, transformCache;

  _ = require('lodash');

  fs = require('fs');

  path = require('path');

  glob = require('glob');

  through2 = require('through2');

  browserify = require('browserify');

  coffee = require('coffee-script');

  gutil = require('gulp-util');

  replaceExtension = require('gulp-util').replaceExtension;

  PluginError = require('gulp-util').PluginError;

  convert = require('convert-source-map');

  transformCache = {};

  aliasMap = {};

  RED = '\u001b[31m';

  RESET = '\u001b[0m';

  traceError = function() {
    var args;
    args = Array.prototype.slice.apply(arguments);
    if (typeof args[0] === 'string') {
      args[0] = RED + args[0];
    } else {
      args.unshift(RED);
    }
    if (typeof args[args.length - 1] === 'string') {
      args[args.length - 1] = args[args.length - 1] + RESET;
    } else {
      args.push(RESET);
    }
    return gutil.log.apply(gutil, args);
  };

  module.exports = function(opts) {
    var aliases;
    if (opts == null) {
      opts = {};
    }
    aliasMap = {};
    if (opts.aliases) {
      aliases = _.isArray(opts.aliases) ? opts.aliases : [opts.aliases];
      aliases.forEach(function(alias) {
        var base, cwd, file;
        if (!alias) {
          return;
        }
        cwd = alias.cwd, base = alias.base, file = alias.file;
        if (!_.isArray(file)) {
          file = ['**/*.coffee', '**/*.js', '**/*.json', '**/*.cson'];
        }
        return file.map(function(pattern) {
          var dir;
          if (!cwd) {
            return;
          }
          dir = cwd;
          if (!dir.match(/^\//)) {
            dir = path.join(process.cwd(), dir);
          }
          pattern = path.join(dir, pattern);
          return glob.sync(pattern).forEach(function(file) {
            alias = path.relative(dir, file);
            if (base) {
              alias = path.join(base, alias);
            }
            alias = alias.replace(/\.[^.]+$/, '');
            alias = alias.replace(/\\+/g, '/');
            return aliasMap[alias] = file;
          });
        });
      });
    }
    if (opts.transforms == null) {
      opts.transforms = [];
    }
    if (!(_.find(opts.transforms, function(transform) {
      return transform.ext === ".coffee";
    }))) {
      opts.transforms.push({
        ext: '.coffee',
        transform: function(data, file) {
          var js, map, ref, v3SourceMap;
          ref = coffee.compile(data, {
            bare: true,
            inline: true,
            sourceMap: true,
            generatedFile: file
          }), js = ref.js, v3SourceMap = ref.v3SourceMap;
          map = convert.fromJSON(v3SourceMap);
          map.setProperty('sources', [file]);
          if (opts.debug) {
            js += "\n" + (map.toComment()) + "\n";
          }
          return js;
        }
      });
    }
    if (!(_.find(opts.transforms, function(transform) {
      return transform.ext === ".cson";
    }))) {
      opts.transforms.push({
        ext: '.cson',
        transform: function(data, file) {
          data = "module.exports =\n" + data;
          return coffee.compile(data);
        }
      });
    }
    return through2.obj(function(file, enc, cb) {
      var b, data, destFile, options, self, srcContents, srcFile, transforms;
      self = this;
      if (file.isStream()) {
        return cb(new PluginError('gulp-coffeeify', 'Streaming not supported'));
      }
      options = _.defaults({}, opts.options);
      transforms = options.transforms;
      delete options.transforms;
      options.filename = file.path;
      if (file.data) {
        options.data = file.data;
      }
      srcFile = file.path;
      srcContents = String(file.contents);
      destFile = replaceExtension(file.path, '.js');
      data = {};
      if (file.isNull()) {
        data.entries = file.path;
      }
      if (file.isBuffer()) {
        data.entries = [file.path];
      }
      options.basedir = path.dirname(file.path);
      if (!options.extensions) {
        options.extensions = ['.coffee', '.cson', '.js', '.json'];
      }
      options.commondir = true;
      b = browserify(data, options);
      b.transform(function(file) {
        return through2.obj(function(data, enc, cb) {
          var cacheSkip, e, extname, filePath, i, j, len, len1, match, matches, module, mtime, raw, ref, relativePath, transform;
          raw = data;
          data = String(data);
          if (data === srcContents) {
            file = srcFile;
          }
          extname = path.extname(file);
          mtime = fs.statSync(file).mtime.getTime();
          filePath = path.relative(process.cwd(), file);
          if (transformCache.hasOwnProperty(file) && transformCache[file][0] === mtime) {
            data = transformCache[file][1];
          } else {
            if (transformCache.hasOwnProperty(file)) {
              gutil.log(gutil.colors.green('coffee-script: recompiling...', filePath));
            } else {
              gutil.log(gutil.colors.green('coffee-script: compiling...', filePath));
            }
            cacheSkip = false;
            ref = opts.transforms;
            for (i = 0, len = ref.length; i < len; i++) {
              transform = ref[i];
              if (extname === transform.ext) {
                try {
                  if (transform.transformRaw) {
                    data = transform.transformRaw(raw, file);
                  } else {
                    data = transform.transform(data, file);
                  }
                  matches = data.match(/require\('.+?'\)/g);
                  if (matches) {
                    for (j = 0, len1 = matches.length; j < len1; j++) {
                      match = matches[j];
                      module = match.match(/require\('(.+?)'\)/)[1];
                      if (aliasMap.hasOwnProperty(module)) {
                        relativePath = "./" + path.relative(path.dirname(file), aliasMap[module]);
                        data = data.replace("require('" + module + "')", "require('" + relativePath + "')");
                      }
                    }
                  }
                } catch (_error) {
                  e = _error;
                  traceError('coffee-script: COMPILE ERROR: ', e.message + ': line ' + (e.location.first_line + 1), 'at', filePath);
                  cacheSkip = true;
                  data = '';
                }
              }
            }
            if (!cacheSkip) {
              transformCache[file] = [mtime, data];
            }
          }
          this.push(data);
          return cb();
        });
      });
      if (transforms) {
        b.transform(transforms);
      }
      return b.bundle(function(err, jsCode) {
        var destFilePath, srcFilePath;
        if (err) {
          traceError(err);
          return;
        } else {
          file.contents = new Buffer(jsCode);
          srcFilePath = path.relative(process.cwd(), srcFile);
          destFilePath = path.relative(process.cwd(), destFile);
          gutil.log(gutil.colors.green("coffeeify: " + srcFilePath + " > " + destFilePath));
          file.path = destFile;
          self.push(file);
        }
        return cb();
      });
    });
  };

}).call(this);
