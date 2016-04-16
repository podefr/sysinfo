"use strict";

const babel = require("gulp-babel");
const buffer = require('vinyl-buffer');
const browserify = require("browserify");
const eslint = require("gulp-eslint");
const gulp = require("gulp");
const gutil = require("gulp-util");
const gulpKarmaRunner = require("gulp-karma-runner");
const sass = require("gulp-sass");
const source = require('vinyl-source-stream');
const sourcemaps = require("gulp-sourcemaps");

gulp.task("default", ["package"]);
gulp.task("package", ["compile", "sass"]);
gulp.task("build", ["test", "lint", "package"]);
gulp.task("watch", ["compile:watch", "sass:watch", "lint:watch"]);
gulp.task("test", ["karma-runner"]);

gulp.task("karma:watch", () => {
    return gulp.watch([
        "src/**/*.js",
        "tests/**/*.spec.js"
    ], ["karma-server"]);
});

gulp.task("karma-server", () => {
    return gulp.src([
        "src/**/*.js",
        "tests/**/*.js"
    ], {
        "read": false
    }).pipe(
        gulpKarmaRunner.server({
            "singleRun": false,
            "quiet": true,
            "frameworks": ["jasmine"],
            "browsers": ["Chrome"]
        })
    );
});

gulp.task("karma-runner", () => {
    return gulp.src([
        "src/**/*.js",
        "test/**/*.js"
    ], {
        "read": false
    }).pipe(
        gulpKarmaRunner.runner({
            "singleRun": false,
            "frameworks": ["jasmine"],
            "browsers": ["Chrome", "Firefox"]
        }));
});

gulp.task("compile", () => {
    let compileBrowserify = browserify({
        entries: './src/index.js',
        debug: true
    });

    return compileBrowserify.bundle()
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(babel())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./public/assets/'));
});

gulp.task("compile:watch", () => {
    return gulp.watch([
        "src/**/*.js",
        "src/**/*.json",
        "modules/**/*.js",
        "modules/**/*.json"], ["compile"]);
});

gulp.task("sass", () => {
    return gulp.src("src/index.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("./public/assets"));
});

gulp.task("sass:watch", () => {
    return gulp.watch("src/**/*.scss", ["sass"]);
});

gulp.task("lint", () => {
    return gulp.src(["**/*.js", "!node_modules/**"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("lint:watch", () => {
    return gulp.watch(["**/*.js", "!node_modules/**"], ["lint"]);
});