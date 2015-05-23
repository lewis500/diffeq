var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var coffeelint = require('gulp-coffeelint')
var jade = require('gulp-jade');
var watchify = require('watchify');

var errorHandler = function(e) {
  gutil.log(e);
  this.emit('end');
};

gulp.task('build', function() {
  return browserify('./app/app.coffee', {
      debug: true,
      extensions: ['.coffee', '.js'],
      transform: ['coffeeify'],
      noparse: ['angular', 'lodash', 'd3']
    })
    .bundle()
    .on('error', notify.onError('build error'))
    .on('error', errorHandler)
    //Pass desired output filename to vinyl-source-stream
    .pipe(source('bundle.js'))
    // Start piping stream to tasks!
    .pipe(gulp.dest('./dist/'));
})

// gulp.task('watch2', function() {
//   gulp.watch('./app/**/*.coffee', ['build']);
// })


// gulp.task('templates', function() {
//   var YOUR_LOCALS = {};

//   gulp.src('./app/**/*.jade')
//     .pipe(jade({
//       locals: YOUR_LOCALS,
//       pretty: true
//     }))
//     .pipe(gulp.dest('./dist'))
// });


gulp.task('watch', function() {
  var bundler = watchify(browserify('./app/app.coffee', {
    debug: true,
    extensions: ['.coffee', '.js'],
    cache: {},
    packageCache: {},
    transform: ['coffeeify']
  }));

  function rebundle() {
    return bundler
      .bundle()
      .on('error', notify.onError('build error'))
      .on('error', errorHandler)
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./dist/'));
  }

  bundler.on('update', rebundle);

  return rebundle();
});

gulp.task('default', ['watch']);

// gulp.task('js', function() {
//   return gulp.src('./app/*.coffee')
//     .pipe(coffee({
//       sourceMaps: true
//     }))
//     .pipe(gulp.dest('./dest/'));
// })
