var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var watchify = require('watchify');
var less = require('gulp-less');
var jade = require('gulp-jade');

var errorHandler = function(e) {
    e.showProperties = false;
    e.stack = ' '
    gutil.log(e);
    this.emit('end');
};

gulp.task('jade', function() {
    return gulp.src('./app/templates/*.jade')
        .pipe(jade({
            pretty: true
        }))
        .on('error', notify.onError('build error'))
        .on('error', errorHandler)
        // .on( 'error', gutil.log)
        .pipe(gulp.dest('./dist/'))
});

gulp.task('thirdParty', function() {
    return browserify({
            require: 
            ['lodash', 'd3', 'angular', 'angular-material', 'textures'],
        })
        .bundle()
        .pipe(source('thirdParty.js'))
        .pipe(gulp.dest('./dist/'))
});

gulp.task('less', function() {
    return gulp.src('./styles/main.less') // only compile the entry file
        .pipe(less())
        .on('error', notify.onError('build error'))
        .on('error', errorHandler)
        .pipe(gulp.dest('./styles'));
});

gulp.task('watch', function() {

    var bundler = watchify(browserify('./app/app.coffee', {
        debug: true,
        extensions: ['.coffee'],
        external: 
            ['lodash', 'd3', 'angular', 'angular-material', 'textures'],
        transform: ['coffeeify'],
        bundleExternal: false
    }));

    gulp.watch('./styles/*.less', ['less']); // Watch all the .less files, then run the less task
    gulp.watch('./**/*.jade', ['jade']);

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

gulp.task('default', ['thirdParty', 'watch']);
