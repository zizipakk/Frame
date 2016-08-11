/// <binding Clean='clean' ProjectOpened='default, clean' />
var fs = require("fs"), 
    ts = require('gulp-typescript'),
    gulp = require('gulp'),
    clean = require('gulp-clean')
    //rename = require('gulp-rename'),
    //uglify = require('gulp-uglify')
    ;

eval("var project = " + fs.readFileSync("./project.json"));
var destPath = "./" + project.webroot + "/libs/";

// Delete the dist directory
gulp.task('clean', function () {
    return gulp.src(destPath)
        .pipe(clean());
});

gulp.task("scriptsNStyles", () => {
    //js with dir
    gulp.src([
            'rxjs/**/*.js',
            '@angular/**/*.js',
            '@angular2-material/**/*.js',
            'angular2-in-memory-web-api/**/*.js',
    ], {
        cwd: "node_modules/**"
    })
        //TODO: min if not exists
        //.pipe(uglify())
        //.pipe(rename({
        //    suffix: '.min'
        //}))
        .pipe(gulp.dest("./wwwroot/libs/js"));

    //js
    gulp.src([
            //wo min
            'systemjs/dist/system.src.js',
            'reflect-metadata/Reflect.js',
            'fancybox/dist/js/jquery.fancybox.pack.js',
            //factory min
            'core-js/client/shim.js', //deb
            'zone.js/dist/zone.js', //deb
            'jquery/dist/jquery.min.js',
            'bootstrap/dist/js/bootstrap.min.js',
            'alertify/lib/alertify.min.js',
            //environment test
            'bootstrap/dist/js/bootstrap.js'
    ], {
        cwd: "node_modules/"
    })
        //TODO: min if not exists
        //.pipe(uglify())
        //.pipe(rename({
        //    suffix: '.min'
        //}))
        .pipe(gulp.dest("./wwwroot/libs/js"));

    //css
    gulp.src([
      'bootstrap/dist/css/bootstrap.css',
      'fancybox/dist/css/jquery.fancybox.css',
      'alertify/themes/alertify.core.css',
      'alertify/themes/alertify.bootstrap.css',
      'alertify/themes/alertify.default.css'
    ], {
        cwd: "node_modules/"
    })
        //TODO: min if not exists
        //.pipe(uglify())
        //.pipe(rename({
        //    suffix: '.min'
        //}))
        .pipe(gulp.dest("./wwwroot/libs/css"));

    gulp.src([
      'font-awesome/css/font-awesome.css'
    ], {
        cwd: "bower_components/"
    })
        .pipe(gulp.dest("./wwwroot/libs/css"));

    //images
    gulp.src([
       'fancybox/dist/img/blank.gif',
       'fancybox/dist/img/fancybox_loading.gif',
       'fancybox/dist/img/fancybox_loading@2x.gif',
       'fancybox/dist/img/fancybox_overlay.png',
       'fancybox/dist/img/fancybox_sprite.png',
       'fancybox/dist/img/fancybox_sprite@2x.png'
    ], {
        cwd: "node_modules/**"
    }).pipe(gulp.dest("./wwwroot/libs/img"));

    //fonts
    gulp.src([
      'bootstrap/fonts/glyphicons-halflings-regular.eot',
      'bootstrap/fonts/glyphicons-halflings-regular.svg',
      'bootstrap/fonts/glyphicons-halflings-regular.ttf',
      'bootstrap/fonts/glyphicons-halflings-regular.woff',
      'bootstrap/fonts/glyphicons-halflings-regular.woff2'
    ], {
        cwd: "node_modules/"
    }).pipe(gulp.dest("./wwwroot/libs/fonts"));

    gulp.src([
      'font-awesome/fonts/FontAwesome.otf',
      'font-awesome/fonts/fontawesome-webfont.eot',
      'font-awesome/fonts/fontawesome-webfont.svg',
      'font-awesome/fonts/fontawesome-webfont.ttf',
      'font-awesome/fonts/fontawesome-webfont.woff',
      'font-awesome/fonts/fontawesome-webfont.woff2'
    ], {
        cwd: "bower_components/"
    }).pipe(gulp.dest("./wwwroot/libs/fonts"));

});

var tsProject = ts.createProject('scripts/tsconfig.json');
gulp.task('ts', function (done) {
    //var tsResult = tsProject.src()
    var tsResult = gulp.src([
            "scripts/**/*.ts"
    ])
        .pipe(ts(tsProject), undefined, ts.reporter.fullReporter());
    return tsResult.js.pipe(gulp.dest('./wwwroot/app/'));
});

gulp.task('watch.ts', ['ts'], function () {
    return gulp.watch('scripts/**/*.ts', ['ts']);
});

gulp.task('watch', ['watch.ts']);

gulp.task('default', ['scriptsNStyles', 'watch']);