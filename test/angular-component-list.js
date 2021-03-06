/**
 * Created by gkarak on 28/7/2016.
 */
'use strict';
var stubRuns = require('../services/stub');
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fs = require('fs-extra');

describe('generator-makrina:angular-component-list', function () {
  var destinationPrefix = 'public/javascripts/admin';
  // run with and without options to increase branch coverage
  var runs = [
    {it: 'no options', options: {}, configFile: true},
    {it: 'no options, no config file', options: {}, configFile: false},
    {it: 'options', options: {
      angularAppName: 'admin',
      angularAppFullName: 'yeotestsAdminApp',
      angularAppPath: 'public/javascripts',
      objectName: 'node',
      objectTitle: 'Node',
      objectUrl: 'node'
    }, configFile: true}
  ];
  var stub = stubRuns(runs, 2);

  beforeEach(function () {
    var run = stub();
    return helpers.run(path.join(__dirname, '../generators/angular-component-list'))
      .inTmpDir(function (dir) {
        fs.copySync(
          path.join(__dirname, '../generators/angular-app/templates/_angular-app-name_.module.js'),
          path.join(dir, destinationPrefix, 'admin.module.js')
        );
        if (run.configFile) {
          fs.copySync(
            path.join(__dirname, '../generators/angular-app/templates/_angular-app-name_.config.js'),
            path.join(dir, destinationPrefix, 'admin.config.js')
          );
        }
      })
      .withOptions(run.options)
      .toPromise();
  });

  runs.forEach(function (run) {
    it('creates files with ' + run.it, function () {
      var paths = [
        'node-list.module.js',
        'node-list.component.js',
        'node-list.component.spec.js',
        'node-list.template.html'
      ];
      paths.forEach(function (p) {
        assert.file(path.join(destinationPrefix, 'node-list', p));
      });
      assert.file('e2e-tests/admin-node.scenarios.js');
    });

    it('updates files with ' + run.it, function () {
      assert.fileContent(path.join(destinationPrefix, 'admin.module.js'), 'nodeList');
      if (run.configFile) assert.fileContent(path.join(destinationPrefix, 'admin.config.js'), 'node-list');
      else assert.noFile(path.join(destinationPrefix, 'admin.config.js'));
    });
  });
});
