'use strict';

var chai = require('chai'),
	inquirer = require('inquirer'),
	gulp = require('gulp'),
	mockGulpDest = require('mock-gulp-dest')(gulp);

chai.should();

require('../slushfile');

describe('slush-ko', function() {
  before(function () {
    process.chdir(__dirname);
  });

  describe('app generator', function () {
    beforeEach(function () {
      mockPrompt({name: 'test-app', includeTests: true, moveon: true});
    });

    it('should put all project files in current working directory', function (done) {
      gulp.start('default').once('stop', function () {
        mockGulpDest.cwd().should.equal(__dirname);
        mockGulpDest.basePath().should.equal(__dirname);
        done();
      });
    });

    it('should add dot files to project root', function(done) {
      gulp.start('default').once('stop', function () {
        mockGulpDest.assertDestContains([
          '.bowerrc',
					'.bowerrc_test',
          '.gitignore',
          '.jshintrc'
        ]);

        done();
      });
    });

    it('should add bower.json and package.json to project root', function (done) {
      gulp.start('default').once('stop', function () {
        mockGulpDest.assertDestContains([
          'package.json',
          'bower.json',
					'jsconfig.json'
        ]);

        done();
      });
    });

    it('should add a gulpfile to project root', function (done) {
      gulp.start('default').once('stop', function () {
        mockGulpDest.assertDestContains('gulpfile.js');
        done();
      });
    });

    it('should add a karma config file to project root', function (done) {
      gulp.start('default').once('stop', function () {
        mockGulpDest.assertDestContains('karma.conf.js');
        done();
      });
    });

	    it('should add an index.html to the app folder', function (done) {
	      gulp.start('default').once('stop', function () {
	        mockGulpDest.assertDestContains('src/index.html');
	        done();
	      });
	    });
  });
});

/**
 * Mock inquirer prompt
 */
function mockPrompt (answers) {
  inquirer.prompt = function (prompts, done) {

    [].concat(prompts).forEach(function (prompt) {
      if (!(prompt.name in answers)) {
        answers[prompt.name] = prompt.default;
      }
    });

    done(answers);
  };
}
