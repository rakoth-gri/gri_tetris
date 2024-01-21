const { dest, series, task, src, parallel, watch } = require("gulp");
// const babel = require("gulp-babel");
const terser = require('gulp-terser');
const clean = require("gulp-clean");
const rename = require("gulp-rename");
const cssmin = require("gulp-cssmin");
// const prefixer = require("gulp-autoprefixer");
const server = require("gulp-server-livereload");
const fs = require("fs");
const htmlmin = require("gulp-htmlmin");

// Настройки сервера ------
const so = {
  livereload: true,
  directoryListing: false,
  open: true,
  port: 3013,
};

task("server", function () {
  src("./").pipe(server(so));
});

task("clean", function (done) {
  if (fs.existsSync("./dist/")) return src("./dist/").pipe(clean());
  done();
});

task("js", function (done) {
  return (
    src("src/js/*.js")      
      .pipe(terser())
      .pipe(rename({ extname: ".min.js" }))
      .pipe(dest("dist/js/"))
  );
  done();
});

task("css", function (done) {
  return src("./src/css/*.css")
    .pipe(cssmin())
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest("dist/css"));
  done();
});

task("html", function (done) {
  return src("./src/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest("./"));
  done();
});

task("watch", function (done) {  
  watch("./src/*.html", parallel("html"));
  watch("./src/css/*.css", parallel("css"));
  watch("./src/js/*.js", parallel("js"));  
});

// дефолтный task
// ф-ция series последовательно выполняет таски, переданные в аргументах (Порядок имеет значение!)
task(
  "default",
  series(
    "clean",
    parallel("js", "css", "html"),
    parallel("watch", "server")
  )
);