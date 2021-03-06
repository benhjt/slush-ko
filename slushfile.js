/*
 * slush-ko
 * https://github.com/benhjt/slush-ko
 *
 * Copyright (c) 2015, benhjt
 * Licensed under the MIT license.
 */
'use strict';

var gulp = require('gulp'),
	install = require('gulp-install'),
	conflict = require('gulp-conflict'),
	template = require('gulp-template'),
	rename = require('gulp-rename'),
	_ = require('underscore.string'),
	inquirer = require('inquirer'),
	path = require('path');

var defaults = (function () {
	var workingDirName = path.basename(process.cwd()),
		homeDir, osUserName, configFile, user;

	if (process.platform === 'win32') {
		homeDir = process.env.USERPROFILE;
		osUserName = process.env.USERNAME || path.basename(homeDir).toLowerCase();
	} else {
		homeDir = process.env.HOME || process.env.HOMEPATH;
		osUserName = homeDir && homeDir.split('/').pop() || 'root';
	}

	configFile = path.join(homeDir, '.gitconfig');
	user = {};

	if (require('fs').existsSync(configFile)) {
		user = require('iniparser').parseSync(configFile).user;
	}

	return {
		name: workingDirName,
		authorName: (typeof user === "object") ? user.name : '',
		authorEmail: (typeof user === "object") ? user.email : ''
	};
})();

gulp.task('default', function (done) {
	var prompts = [{
		name: 'name',
		message: 'What\'s the name of your new site?',
		default: defaults.name
	},{
		type: 'confirm',
		name: 'includeTests',
		message: 'Do you want to include automated tests, using Jasmine and Karma?',
		default: true
	}, {
    type: 'confirm',
    name: 'moveon',
    message: 'Continue?'
  }];

	//Ask
	inquirer.prompt(prompts,
		function (answers) {
			if (!answers.moveon) {
				return done();
			}
			answers.longName = answers.name;
			answers.slugName = _.slugify(answers.longName);
			gulp.src(__dirname + '/templates/app/**')
				.pipe(template(answers))
				.pipe(rename(function (file) {
					if (file.basename[0] === '_') {
						file.basename = '.' + file.basename.slice(1);
					}
				}))
				.pipe(conflict('./'))
				.pipe(gulp.dest('./'))
				.pipe(install())
				.on('finish', function () {
					done();
				});
		});
});
