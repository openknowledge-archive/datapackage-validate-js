var assert = require('assert')
  , fs = require('fs')
  , tools = require('../index')
  ;

var sourceUrl = 'https://raw.github.com/datasets/gold-prices/master/datapackage.json'; 

describe('validate', function() {
  it('bad JSON', function() {
    var out = tools.validate('{"xyz"');
    assert.equal(out.errors.length, 1);
    assert.equal(out.errors[0].message, 'Invalid JSON');
  });
  it('invalid for schema', function() {
    var out = tools.validate('"xyz"');
    assert.equal(out.valid, false);
    assert.equal(out.errors.length, 1);
    assert.equal(out.errors[0].message, 'Instance is not a required type');
  });
  it('good datapackage.json', function() {
    var data = {
      "name": "abc",
      "resources": []
    };
    var out = tools.validate(JSON.stringify(data));
    assert.equal(out.valid, true);
    assert.equal(out.errors.length, 0);
  });
  it('remote datapackage.json ok', function(done) {
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

