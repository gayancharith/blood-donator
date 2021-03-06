// gulpfile.js
var gulp = require('gulp');
// var server = require('gulp-express');
var gls = require('gulp-live-server');
// var mocha = require('gulp-mocha');
var mocha = require('gulp-mocha');
var babel = require('babel/register');
var jshint = require('gulp-jshint');
var map = require('map-stream');
var symlink = require('gulp-symlink'); //Again don't forget to install it

var paths = {
  scripts: ['server.js', 'api/**/*.js', 'config/*.js'],
  hints: ['server.js', 'api/**/*.js', 'test/**/*.js', 'config/*.js'],
  hooks: 'hooks/.pre-commit',
  images: 'client/img/**/*'
};

var errorReporter = function () {
  return map(function (file, cb) {
    if (!file.jshint.success) {
      process.exit(1);
    }
    cb(null, file);
  });
};

gulp.task('server', function() {
  //1. run your script as a server
  var server = gls.new('index.js');
  server.start();

  gulp.watch(paths.scripts, function() {
    server.start.apply(server);
  });
});

gulp.task('test', function() {
    return gulp.src(['tests/bootstrap.js', 'tests/**/*.js'])
        .pipe(mocha({
            compilers: {
                js: babel
            }
        }))
        .once('error', function () {
            process.exit(1);
        })
        .once('end', function () {
            process.exit();
        });
});

gulp.task('test-watch', function() {
    gulp.watch(['tests/**/*.js'], ['test']);
});

// JS hint task
gulp.task('jshint', function() {
  gulp.src(paths.hints)
    .pipe(jshint({
        "strict": false,
        "globals": {
            "logger": false,
            "models": false,
            "appRoot": false
        }
    }))
    .pipe(jshint.reporter('default'))
    .pipe(errorReporter());
});

gulp.task('watch', function() {
    // gulp.watch(paths.scripts, ['server']);
    gulp.watch(paths.hints, ['jshint']);
});

gulp.task('hook', function () {
  return gulp.src(paths.hooks)
    .pipe(symlink('../.git/hooks/pre-commit'));
});

gulp.task('default',['server']);
gulp.task('test-server', ['server', 'test-watch'])
