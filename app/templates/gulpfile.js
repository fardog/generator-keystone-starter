var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jshintReporter = require('jshint-stylish');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var browserify = require('gulp-browserify');
var spawn = require('child_process').spawn;

/*
 * Create variables for our project paths so we can change in one place
 */
var paths = {
	'src':['./models/**/*.js','./routes/**/*.js', 'keystone.js', 'package.json'],
	// enable for tests
	//'tests':['./test/*.js', './test/**/*.js']
	'js':['./src/app.js'],
};

var keystoneProcess = null;

gulp.task('keystone', function() {
	// need to kill the process prior to reload
	if (keystoneProcess) {
		keystoneProcess.kill();
	}

	keystoneProcess = spawn('env', ['node', 'keystone'], {
		detached: false,
		stdio: [ 'ignore', process.stdout, process.stderr ]
	});

	keystoneProcess.unref();
});

gulp.task('lint', function(){
	gulp.src(paths.src.concat(paths.js))
		.pipe(jshint())
		.pipe(jshint.reporter(jshintReporter));
});

gulp.task('browserify', function () {
	gulp.src(paths.js)
		.pipe(browserify({
          debug : !gulp.env.production
		}))
		.pipe(gulp.dest('./public/js'));
});

gulp.task('sendLivereloadChanged', function () {
	livereload.changed();
});

// development watcher
gulp.task('watch', ['keystone'], function () {
	livereload.listen();
	gulp.watch(paths.src, ['lint', 'keystone', 'sendLivereloadChanged']);
	gulp.watch(paths.js, ['lint', 'browserify', 'sendLivereloadChanged']);
});

