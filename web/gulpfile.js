"use strict";

const babel = require("gulp-babel");
const concat = require("gulp-concat");
const eslint = require("gulp-eslint");
const gulp = require("gulp");
const gulpKarmaRunner = require("gulp-karma-runner");
const sass = require("gulp-sass");
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
    return gulp.src("src/index.js")
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat("index.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("public/assets"));
});

gulp.task("compile:watch", () => {
    return gulp.watch("src/**/*.js", ["compile"]);
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