'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var lodash = require('lodash');
var uuid = require('uuid');
var password = require('xkcd-pass-plus');
var buildContext = require('../../services/build-context');
var pathNames = require('../../services/path-names');
var prompts = require('../../services/prompts');

module.exports = yeoman.Base.extend({
  prompting: function () {
    this.log(yosay(
      'Welcome to the ' + chalk.red('generator-makrina') + ' MEAN generator'
    ));

    var appPrompts = prompts.mainPrompts(this)
      .concat(prompts.angularAppPrompts(this), prompts.angularObjectPrompts(this));
    return this.prompt(appPrompts).then(function (props) {
      this.props = props;
    }.bind(this));
  },

  // non-standard method matches to (4) default in run loop before writing
  composing: function () {
    var options = {
      angularAppName: this.props.angularAppName,
      angularAppFullName: this.props.angularAppFullName,
      angularAppPath: this.props.angularAppPath
    };
    this.composeWith('makrina:angular-app', {options: options});
    lodash.extend(options, {
      objectName: this.props.objectName,
      objectTitle: this.props.objectTitle,
      objectUrl: this.props.objectUrl
    });
    this.composeWith('makrina:angular-core-service', {options: options});
    this.composeWith('makrina:angular-component-list', {options: options});
    this.composeWith('makrina:angular-component-detail', {options: options});
    this.composeWith('makrina:model', {options: options});
  },

  saveConfig: function () {
    this.config.set('name', this.props.name);
    this.config.set('verboseName', this.props.verboseName);
    this.config.set('description', this.props.description);
    this.config.set('git', this.props.git);
    this.config.set('angularAppName', this.props.angularAppName);
    this.config.set('angularAppFullName', this.props.angularAppFullName);
    this.config.set('angularAppPath', this.props.angularAppPath);
    this.config.set('objectName', this.props.objectName);
    this.config.set('objectTitle', this.props.objectTitle);
    this.config.set('objectUrl', this.props.objectUrl);
  },

  writing: function () {
    // explicitly define paths to manipulate output file names
    var templatePaths = [
      'bin/',
      'e2e-tests/protractor.conf.js',
      'public/images/',
      'public/javascripts/_name_.js',
      'public/stylesheets/_name_.sass',
      'routes/',
      'services/',
      'spec/',
      'views/',
      '_editorconfig',
      '_gitignore',
      '_gitlab-ci.yml',
      'app.js',
      'CHANGELOG',
      'CONTRIBUTING.md',
      'fonts.list',
      'gulpfile.js',
      'karma.conf.js',
      'LICENSE',
      'newrelic.js',
      'package.json',
      'README.md'
    ];
    var copyPaths = [
      'public/images/'
    ];

    // Template context variables
    var git = this.props.git;
    // Remove prefix/suffix from git repo to add in template
    if (git.startsWith('git+')) git = git.substring(4, git.length - 4);
    if (git.endsWith('.git')) git = git.substring(0, git.length - 4);

    var context = buildContext({
      name: this.props.name,
      verboseName: this.props.verboseName,
      description: this.props.description,
      git: git,
      author: this.props.author,
      deployHost: this.props.deployHost,
      newRelicLicense: this.props.newRelicLicense,
      uuid: uuid.v4(),
      pass: password({
        paddingDigits: {before: 0, after: 0},
        paddingSymbols: {before: 0, after: 0}
      }),
      organization: this.props.organization,
      organizationUrl: this.props.organizationUrl,
      angularAppFullName: this.props.angularAppFullName,
      objectTitle: this.props.objectTitle,
      objectUrl: this.props.objectUrl,
      header: function (val, char) {
        // return an underline of `char`s for markdown based on `val` length
        return new Array(val.length + 1).join(char);
      }
    });
    var $this = this;

    // Copy all templates
    templatePaths.forEach(function (templatePath) {
      $this.fs.copyTpl(
        $this.templatePath(templatePath),
        $this.destinationPath(pathNames(templatePath, $this.props)),
        context
      );
    });

    // Copy files that do not need template
    copyPaths.forEach(function (copyPath) {
      $this.fs.copy(
        $this.templatePath(copyPath),
        $this.destinationPath(copyPath)
      );
    });
  },

  install: function () {
    this.installDependencies();
  }
});
