/**
 * Created by yeoman generator-makrina <%= version %> on <%= date %>.
 */
var expect = require('chai').expect;
var request = require('supertest');
var app = require('../app');

describe('Routing: Index', function() {
  it('should provide the index page', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        expect(res.text)
          .to.contain('<%= verboseName %>', 'Title in body');
        done();
      });
  });
  it('should provide the index page for english', function(done) {
    request(app)
      .get('/en')
      .expect(200)
      .end(done);
  });
  it('should return 404', function(done) {
    request(app)
      .get('/not-existing')
      .expect(404)
      .end(done);
  });
});
