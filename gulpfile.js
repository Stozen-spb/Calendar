var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var autoprefixer = require("gulp-autoprefixer");
var server = require("browser-sync");
var minify = require("gulp-csso");
var rename = require("gulp-rename");

gulp.task ("style", function() {
	gulp.src("less/style.less")
		.pipe(plumber())
		.pipe(less())
		.pipe(autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'Firefox >= 20'],
            cascade: false
        }))
        .pipe(server.reload({stream:true}))
        .pipe(gulp.dest('build/css'))
        .pipe(minify())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('build/css'));
        


});

gulp.task("serve", ["style"], function(){
	server.init({
		server: 'build' 	
	})
gulp.watch("less/**/*.less", ["style"]);
gulp.watch("build/*.html")
	.on("change", server.reload);	

});

