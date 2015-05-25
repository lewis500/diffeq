
_           = require 'lodash'
fs          = require 'fs'
path        = require 'path'
glob        = require 'glob'
through2    = require 'through2'
browserify  = require 'browserify'
coffee      = require 'coffee-script'
gutil       = require 'gulp-util'
replaceExtension = require('gulp-util').replaceExtension
PluginError = require('gulp-util').PluginError
convert     = require 'convert-source-map'

# cache
transformCache = {}
aliasMap = {}

# error
RED   = '\u001b[31m'
RESET = '\u001b[0m'
traceError = ->
  args = Array::slice.apply arguments
  if typeof args[0] is 'string'
    args[0] = RED + args[0]
  else
    args.unshift RED

  if typeof args[args.length - 1] is 'string'
    args[args.length - 1] = args[args.length - 1] + RESET
  else
    args.push RESET
  gutil.log.apply gutil, args

# 
module.exports = (opts = {})->

  # create alias map
  aliasMap = {}
  if opts.aliases
    aliases = if _.isArray(opts.aliases) then opts.aliases else [opts.aliases]
    aliases.forEach (alias)->
      return unless alias
      { cwd, base, file } = alias
      file = ['**/*.coffee', '**/*.js', '**/*.json', '**/*.cson'] unless _.isArray file
      file.map (pattern)->
        return unless cwd
        dir = cwd
        dir = path.join(process.cwd(), dir) unless dir.match /^\//
        pattern = path.join dir, pattern
        glob.sync(pattern).forEach (file)->
          alias = path.relative dir, file
          alias = path.join base, alias if base
          alias = alias.replace /\.[^.]+$/, ''
          alias = alias.replace /\\+/g, '/'
          aliasMap[alias] = file

  opts.transforms ?= []

  unless(_.find opts.transforms, (transform) -> transform.ext is ".coffee")
    opts.transforms.push
      ext: '.coffee'
      transform: (data, file)->
        { js, v3SourceMap } = coffee.compile data, bare: true, inline: true, sourceMap: true, generatedFile: file
        map = convert.fromJSON v3SourceMap
        map.setProperty 'sources', [file]
        js += "\n#{map.toComment()}\n" if opts.debug
        js

  unless(_.find opts.transforms, (transform) -> transform.ext is ".cson")
    opts.transforms.push
      ext: '.cson'
      transform: (data, file)->
        data = "module.exports =\n" + data
        coffee.compile data

  # through
  through2.obj (file, enc, cb)->
    self = this

    if file.isStream()
      return cb new PluginError 'gulp-coffeeify', 'Streaming not supported'

    options = _.defaults {}, opts.options

    transforms = options.transforms
    delete options.transforms

    options.filename = file.path
    options.data = file.data if file.data

    srcFile  = file.path
    srcContents = String file.contents

    destFile = replaceExtension(file.path, '.js')

    data = {}
    if file.isNull()
      data.entries = file.path
    if file.isBuffer()
      data.entries = [file.path]

    options.basedir = path.dirname(file.path)

    unless options.extensions
      options.extensions = ['.coffee', '.cson', '.js', '.json']

    options.commondir = true

    b = browserify(data, options)

    b.transform (file)->

      return through2.obj (data, enc, cb)->
        raw = data
        data = String data

        if data is srcContents
          file = srcFile

        extname = path.extname file
        mtime   = fs.statSync(file).mtime.getTime()

        filePath = path.relative process.cwd(), file

        if transformCache.hasOwnProperty(file) and transformCache[file][0] is mtime
          data = transformCache[file][1]
        else
          if transformCache.hasOwnProperty(file)
            gutil.log gutil.colors.green 'coffee-script: recompiling...', filePath
          else
            gutil.log gutil.colors.green 'coffee-script: compiling...', filePath

          cacheSkip = false
          for transform in opts.transforms
            if extname is transform.ext
              try
                if transform.transformRaw
                  data = transform.transformRaw raw, file
                else
                  data = transform.transform data, file

                matches = data.match /require\('.+?'\)/g
                if matches
                  for match in matches
                    module = match.match(/require\('(.+?)'\)/)[1]
                    if aliasMap.hasOwnProperty module
                      relativePath = "./" + path.relative path.dirname(file), aliasMap[module]
                      data = data.replace "require('#{module}')", "require('#{relativePath}')"

              catch e
                traceError 'coffee-script: COMPILE ERROR: ', e.message + ': line ' + (e.location.first_line + 1), 'at', filePath
                cacheSkip = true
                data = ''

          transformCache[file] = [mtime, data] unless cacheSkip
        @push data
        cb()

    b.transform transforms if transforms

    b.bundle (err, jsCode)->

      if err
        traceError err
        return

      else

        # output
        file.contents = new Buffer jsCode

        srcFilePath = path.relative process.cwd(), srcFile
        destFilePath = path.relative process.cwd(), destFile

        # 
        gutil.log gutil.colors.green "coffeeify: #{srcFilePath} > #{destFilePath}"

        file.path = destFile
        self.push file
      
      # callback
      cb()
