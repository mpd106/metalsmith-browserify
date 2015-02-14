var browserify = require('..');
var Metalsmith = require('metalsmith');
var assert = require('assert');
var equal = require('assert-dir-equal');

describe('metalsmith-browserify', function() {
  it('should run browserify on source', function(done) {
    Metalsmith('test/fixtures/basic')
      .use(browserify({
        files: ['scripts/source.js'],
        dest: 'scripts/bundle.js'
      }))
      .build(function(err) {
        if (err) return done(err);
        equal('test/fixtures/basic/expected', 'test/fixtures/basic/build');
        done();
      });
  });

  it('should run browserify on multiple source files', function(done) {
    Metalsmith('test/fixtures/multiple')
      .use(browserify({
        files: ['scripts/awesome.js', 'scripts/hats.js'],
        dest: 'scripts/bundle.js'
      }))
      .build(function(err) {
        if (err) return done(err);
        equal('test/fixtures/multiple/expected', 'test/fixtures/multiple/build');
        done();
      });
  });
  
  it('should overwrite copied source file of same name', function(done) {
    Metalsmith('test/fixtures/samename')
      .use(browserify({
        files: ['scripts/awesome.js', 'scripts/hats.js'],
        dest: 'scripts/hats.js'
      }))
      .build(function(err) {
        if (err) return done(err);
        equal('test/fixtures/samename/expected', 'test/fixtures/samename/build');
        done();
      });
  });

  it('should exclude other js files from destination', function(done) {
    Metalsmith('test/fixtures/remove other sources')
      .use(browserify({
        files: ['scripts/awesome.js', 'scripts/hats.js'],
        dest: 'scripts/hats.js',
        excludeOtherSources: true
      }))
      .build(function(err) {
        if (err) return done(err);
        equal('test/fixtures/remove other sources/expected', 'test/fixtures/remove other sources/build');
        done();
      });
  });

  it('should emit a source map', function(done) {
    Metalsmith('test/fixtures/sourcemap')
      .use(browserify({
        files: ['scripts/source.js'],
        dest: 'scripts/bundle.js',
        excludeOtherSources: true,
        emitSourceMap: true
      }))
      .build(function(err) {
        if (err) return done(err);
        equal('test/fixtures/sourcemap/expected', 'test/fixtures/sourcemap/build');
        done();
      });
    });
});
