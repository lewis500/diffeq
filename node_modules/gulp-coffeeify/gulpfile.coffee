
# require modules
gulp        = require 'gulp'
del         = require 'del'
coffee      = require 'gulp-coffee'
runSequence = require 'run-sequence'
through2    = require 'through2'
datauri     = require 'datauri'

# Clean
gulp.task 'clean', (cb)->
  del 'lib', cb
gulp.task 'clean-test', (cb)->
  del 'test-build', cb

# Build
gulp.task 'build', ->
  gulp.src 'src/**/*.coffee'
    .pipe coffee()
    .pipe gulp.dest 'lib'

# Test
gulp.task 'test', ->
  gulp.src 'test/**/*.coffee'
    .pipe require('./lib/coffeeify')
      aliases:
        { cwd: './test', base: 'test' }
      options:
        debug: true
        transforms: (file)->
          return through2.obj (data, enc, cb)->

            matches = data.match /dataURI\(.+\.(png|jpe?g|gif)\)/g
            if matches
              for match in matches
                dataURI = match.replace /dataURI\((.+\.(png|jpe?g|gif))\)/, (all, imageURL)->
                  return datauri imageURL
                data = data.replace match, dataURI

            @push data
            cb()
    .pipe gulp.dest 'test-build'

# Default task
gulp.task 'default', ->
  runSequence ['clean', 'clean-test'], 'build', 'test'
