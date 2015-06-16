var assert = require('assert')
  , fs = require('fs')
  , tools = require('../index')
  ;

describe('validate JSON', function() {
  it('bad JSON', function() {
    tools.validate('{"xyz"', {}).then(function(O) {
      assert.equal(O.errors.length, 1);
      assert.equal(O.errors[0].message, "Invalid JSON: EOF Error, expecting closing '}'.");
    });
  });

  it('bad JSON subtler', function() {
    tools.validate('{\n \
  "name": "xyz"\n\
  "title": "xxx"\n\
    ', {}).then(function(O) {
      assert.equal(O.errors.length, 1);
      assert.equal(O.errors[0].line, 3);
      assert.equal(O.errors[0].character, 3);
    });
  });
});

describe('validate schema', function() {
  it('invalid for schema', function(done) {
    this.timeout(10000);
    tools.validate('["xyz"]').then(function(O) {
      // console.log(JSON.stringify(out, null, 2));
      assert.equal(O.valid, false);
      assert.equal(O.errors.length, 1);
      assert.equal(O.errors[0].message.toLowerCase(), 'invalid type: array (expected object)')
      done();
    });
  });
  it('good datapackage.json', function(done) {
    var data = {
      "name": "abc",
      "resources": [{
        "path": "data/data.csv"
      }]
    };
    this.timeout(10000);
    tools.validate(data).then(function(O) {
      // console.log(JSON.stringify(out, null, 2));
      assert.equal(O.valid, true);
      assert.equal(O.errors.length, 0);
      done();
    });
  });
});

describe('validate remote data package', function() {
  var sourceUrl = 'https://raw.github.com/datasets/gold-prices/master/datapackage.json'; 

  it('remote datapackage.json ok', function(done) {
    this.timeout(10000);
    tools.validateUrl(sourceUrl, function(out) {
      assert.equal(out.valid, true);
      done();
    });
  });
  it('bad remote datapackage.json not ok', function(done) {
    this.timeout(4000);
    tools.validateUrl(sourceUrl + 'xxx', function(out) {
      assert.equal(out.valid, false);
      assert.equal(out.errors[0].message, 'Error loading the datapackage.json file. HTTP Error code: 404');
      done();
    });
  });
});

