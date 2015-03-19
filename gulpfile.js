var Q= require('q'),
    gulp = require('gulp'),
    util = require('gulp-util'),
    less = require('gulp-less'),
    cssmin = require('gulp-cssmin'),
    autoprefixer = require('gulp-autoprefixer'),
    rimraf = require('gulp-rimraf'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    flatten = require('gulp-flatten'),
    inject = require('gulp-inject'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    merge = require('merge-stream'),
    wrap = require('gulp-wrap'),
    templateCache = require('gulp-angular-templatecache'),
    replace = require('gulp-replace'),
    debug = require('gulp-debug'),
    livereload = require('gulp-livereload');

/////////////////////
// User-defined paths
/////////////////////
var config = require('./config.json'),
    PATHS = config.PATHS;


////////////
// Constants
////////////
var VENDOR_SCRIPTS = [
    'bower_components/modernizr/modernizr-custom.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/angular-utils-pagination/dirPagination.js'
];

var log = function(message) {
    util.log(util.colors.green(message));
};

////////
// tasks
////////
function clean(target) {
    var deferred = Q.defer();
    log('cleaning files: ' + target);

    gulp.src(target)
        .pipe(rimraf())
        .on('error', log)
        .on('end', deferred.resolve)
        .pipe(debug());

    return deferred.promise;
}

gulp.task('scripts', function() {
    var deferred = Q.defer();
    var appScripts;

    clean(['!./build/scripts/templates.js', './build/scripts/app/**/*.js', './dist/scripts/main.js']).then(function() {
        log('building javascript');
        appScripts = gulp.src('src/app/**/*.js')
            // run jshint
            .pipe(jshint())
            .pipe(jshint.reporter('default'))
            // annotate the Angular so it can be minified
            .pipe(ngAnnotate())
            .on('error', deferred.reject)
            // wrap each file in an IIFE to keep global scope clean
            .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
            // replace the constant values placeholders with the actual data
            .pipe(replace(/%%ROOT_URL%%/, PATHS['build'].basePath))
            .pipe(replace(/%%API_URL%%/, PATHS['build'].apiUrl))
            // write the scripts to the build dir
            .pipe(gulp.dest('build/scripts/app'))
            // replace the build constant values with the dist constants
            .pipe(replace(PATHS['build'].basePath, PATHS['dist'].basePath))
            .pipe(replace(PATHS['build'].apiUrl, PATHS['dist'].apiUrl))
            // concatenate and minify
            .pipe(concat('main.js'))
            .pipe(uglify())
            .pipe(rename({ suffix: '.min'}))
            // write to dist dir
            .pipe(gulp.dest('dist/scripts/'))
            .on('end', deferred.resolve)
            .pipe(livereload({ auto: false }));
    });

    return deferred.promise;
});

gulp.task('vendor-scripts', function() {
    var deferred = Q.defer();

    clean([ './build/scripts/bower_components/**/*.js', './dist/scripts/vendor.js']).then(function() {
        log('building vendor javascript');

        gulp.src(VENDOR_SCRIPTS, { base: '.' })
            .pipe(gulp.dest('build/scripts/'))
            .pipe(concat('vendor.js'))
            .pipe(uglify())
            .pipe(rename({ suffix: '.min'}))
            .pipe(gulp.dest('dist/scripts/'))
            .on('end', deferred.resolve);
    });

    return deferred.promise;
});

gulp.task('styles', function() {
    var deferred = Q.defer();
    var vendorStyles, appStyles;

    clean(['./build/**/*.css', './dist/**/*.css']).then(function() {
        log('building CSS');
        appStyles =  gulp.src('src/less/main.less')
            .pipe(less())
            .pipe(autoprefixer());

        vendorStyles = gulp.src(['bower_components/pure/pure.css', 'bower_components/pure/grids-responsive.css']);

        merge(vendorStyles, appStyles)
            .pipe(gulp.dest('build/styles'))
            .pipe(concat('style.min.css'))
            .pipe(cssmin())
            .pipe(gulp.dest('dist/styles'))
            .on('end', deferred.resolve)
            .pipe(livereload({ auto: false }));
    });

    return deferred.promise;
});

gulp.task('templates', function() {
    var deferred = Q.defer();

    clean(['./build/scripts/templates.js']).then(function() {
        log('compiling templates');
        return gulp.src('./src/app/**/*.tpl.html', './src/common/**/*.tpl.html')
            .pipe(templateCache('templates.js', { module: 'app'}))
            .pipe(gulp.dest('build/scripts/'))
            .pipe(uglify())
            .pipe(rename({ suffix: '.min'}))
            .pipe(gulp.dest('dist/scripts/'))
            .on('end', deferred.resolve)
            .pipe(livereload({ auto: false }));
    });

    return deferred.promise;
});

gulp.task('static-assets', function() {
    var deferred = Q.defer();

    clean(['./build/assets', './dist/assets']).then(function() {
        var detritus, staticPage, htaccess, assets;
        log('copying static assets');

        // contents of the assets folder
        assets = gulp.src('./src/assets/**/*.*')
            .pipe(gulp.dest('build/assets/'))
            .pipe(gulp.dest('dist/assets/'));

        // .htaccess file
        htaccess =  gulp.src('./src/app/.htaccess')
            .pipe(replace(/%%SITE_URL%%/, PATHS['build'].siteUrl))
            .pipe(gulp.dest('build'))
            .pipe(replace(PATHS['build'].siteUrl, PATHS['dist'].siteUrl))
            .pipe(gulp.dest('dist'));

        // static-page.php file
        staticPage =  gulp.src('./src/app/static-page.php')
            .pipe(replace(/%%API_URL%%/g, PATHS['build'].apiUrl))
            .pipe(replace(/%%SITE_URL%%/g, PATHS['build'].siteUrl))
            .pipe(gulp.dest('build'))
            .pipe(replace(PATHS['build'].apiUrl, PATHS['dist'].apiUrl))
            .pipe(replace(PATHS['build'].siteUrl, PATHS['dist'].siteUrl))
            .pipe(gulp.dest('dist'));

        // other detritus
        detritus =  gulp.src([
                './src/app/google*.html',
                './src/app/BingSiteAuth.xml',
                './src/app/favicon.ico',
                './src/app/robots.txt'
            ])
            .pipe(gulp.dest('build'))
            .pipe(gulp.dest('dist'));

        merge(assets, htaccess, staticPage, detritus)
            .on('end', deferred.resolve);
    });
    return deferred.promise;
});

gulp.task('static-page-inject', ['styles', 'static-assets'], function() {
    var deferred = Q.defer();

    var buildCss = gulp.src(['styles/pure.css','styles/**/*.css'], { cwd: 'build' });
    var build = gulp.src('build/static-page.php')
        .pipe(inject(buildCss, { addRootSlash: false }))
        .pipe(gulp.dest('./build'));

    var distCss = gulp.src(['styles/style.min.css'], { cwd: 'dist' });
    var dist = gulp.src('dist/static-page.php')
        .pipe(inject(distCss, { addRootSlash: false }))
        .pipe(gulp.dest('./dist'));

    log('injecting css into static-page.php');

    merge(build, dist)
        .on('end', deferred.resolve);

    return deferred.promise;
});

gulp.task('index', ['scripts', 'vendor-scripts', 'styles', 'templates', 'static-assets', 'static-page-inject'], function index() {
    buildIndex('build');
    buildIndex('dist');
});

function buildIndex(path) {
    var files;
    var sources;

    log('injecting generated files into ' + path + '/index.html');

    files = VENDOR_SCRIPTS
        .map(function(file) {
            return 'scripts/' + file;
        }).concat(
            'scripts/vendor.min.js',
            'scripts/main.min.js',
            'scripts/app/app.js',
            'scripts/app/**/*.js',
            'scripts/templates*.js',
            'styles/pure.css',
            'styles/**/*.css');

    sources = gulp.src(files, { cwd: path });

    gulp.src('src/app/index.html')
        .pipe(inject(sources, { addRootSlash: false }))
        // set the <base> meta tag
        .pipe(replace(/%%BASE_PATH%%/, PATHS[path].basePath))
        .pipe(gulp.dest('./' + path));
}


gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('src/app/**/*.js', ['scripts']);
    gulp.watch('src/app/**/*.tpl.html', ['templates']);
    gulp.watch('src/less/*.less', ['styles']);
    gulp.watch('src/app/index.html', ['index']);
    gulp.watch(['src/assets/**/*.*', 'src/app/.htaccess', 'src/app/static-page.php'], ['static-assets']);
});

gulp.task('default', ['index']);