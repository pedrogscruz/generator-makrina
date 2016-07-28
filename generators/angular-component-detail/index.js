/**
 * Created by gkarak on 28/7/2016.
 */
'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var lodash = require('lodash');
var buildPrompts = require('../../services/prompts');
var buildContext = require('../../services/build-context');
var pathNames = require('../../services/path-names');
var append = require('../../services/append');
var path = require('path');

module.exports = yeoman.Base.extend({
  prompting: function () {
    this.log('Generating ' + chalk.red('angular-component-detail') + ' module');

    return this.prompt(this.options.objectName ? [] : buildPrompts(this))
      .then(function (props) {
        this.props = props;
      }.bind(this));
  },

  writing: function () {
    var templatePaths = [
      '_object-name_-detail.module.js',
      '_object-name_-detail.component.js.ejs',
      '_object-name_-detail.component.spec.js.ejs',
      '_object-name_-detail.template.html'
    ];

    if (this.options.objectName) lodash.extend(this.props, this.options);
    var context = buildContext({
      angularAppName: this.props.angularAppName,
      objectName: this.props.objectName,
      objectTitle: this.props.objectTitle,
      objectUrl: this.props.objectUrl
    });
    var $this = this;
    var destinationPrefix = path.join(
      'public/javascripts/',
      this.props.angularAppName,
      this.props.objectUrl + '-detail'
    );

    templatePaths.forEach(function (templatePath) {
      $this.fs.copyTpl(
        $this.templatePath(templatePath),
        $this.destinationPath(path.join(destinationPrefix, pathNames(templatePath, $this.props))),
        context
      );
    });

    // Modify files: append object-detail to app module
    var templatePath = path.join(
      'public/javascripts/',
      this.props.angularAppName,
      this.props.angularAppName + '.module.js'
    );
    this.fs.copy(
      this.destinationPath(templatePath), this.destinationPath(templatePath), {
        process: function (content) {
          return append.dependency(content, $this.props.objectName + 'Detail');
        }
      });

    // Modify files: append object-list route to app config
    templatePath = path.join(
      'public/javascripts/',
      this.props.angularAppName,
      this.props.angularAppName + '.config.js'
    );
    this.fs.copy(
      this.destinationPath(templatePath), this.destinationPath(templatePath), {
        process: function (content) {
          return append.angularRoute(
            content,
            $this.props.objectUrl + 's/:' + $this.props.objectName + 'Id',
            $this.props.objectName + '-detail');
        }
      });
  }
});