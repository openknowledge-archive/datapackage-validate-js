var assert = require('assert')
  , fs = require('fs')
  , tools = require('../index')
  ;

describe('validate', function() {
  it('bad JSON', function() {
    var out = tools.validate('{"xyz"');
    assert.equal(out.errors.length, 1);
    assert.equal(out.errors[0].message, 'Invalid JSON');
  });
  it('invalid for schema', function() {
    var out = tools.validate('"xyz"');
    // console.log(JSON.stringify(out, null, 2));
    assert.equal(out.valid, false);
    assert.equal(out.errors.length, 1);
    assert.equal(out.errors[0].message, "invalid type: string (expected object)");
  });
  it('good datapackage.json', function() {
    var data = {
      "name": "abc",
      "resources": [{
        "path": "data/data.csv"
      }]
    };
    var out = tools.validate(data);
    // console.log(JSON.stringify(out, null, 2));
    assert.equal(out.valid, true);
    assert.equal(out.errors.length, 0);
  });
});

describe('validate remote data package', function() {
  var sourceUrl = 'https://raw.github.com/datasets/gold-prices/master/datapackage.json'; 

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

