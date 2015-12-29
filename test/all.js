var assert = require('assert')
  , fs = require('fs')
  , tools = require('../index')
  , tv4 = require('tv4')
  ;

describe('validate JSON', function () {
  it('bad JSON', function () {
    tools.validate('{"xyz"', {}).then(function (O) {
      assert.equal(O.errors.length, 1);
      assert.equal(O.errors[0].message, "Invalid JSON: EOF Error, expecting closing '}'.");
    });
  });

  it('bad JSON subtler', function () {
    tools.validate('{\n \
  "name": "xyz"\n\
  "title": "xxx"\n\
    ', {}).then(function (O) {
      assert.equal(O.errors.length, 1);
      assert.equal(O.errors[0].line, 3);
      assert.equal(O.errors[0].character, 3);
    });
  });
});

describe('validate schema', function () {
  it('invalid for schema', function (done) {
    this.timeout(10000);
    tools.validate('["xyz"]').then(function (O) {
      // console.log(JSON.stringify(out, null, 2));
      assert.equal(O.valid, false);
      assert.equal(O.errors.length, 1);
      assert.equal(O.errors[0].message.toLowerCase(), 'invalid type: array (expected object)')
      done();
    });
  });

  it('good datapackage.json', function (done) {
    var data = {
      "name": "abc",
      "resources": [{
        "path": "data/data.csv"
      }]
    };


    this.timeout(10000);

    tools.validate(data).then(function (O) {
      // console.log(JSON.stringify(out, null, 2));
      assert.equal(O.valid, true);
      assert.equal(O.errors.length, 0);
      done();
    });
  });
});

describe('validate schema with $ref', function () {
  var data = {
    "name": "34534543",
    "title": "test",
    "resources": [{
      "name": "all.csv",
      "schema": {
        "fields": [{
          "name": "ID",
          "type": "integer",
          "format": "default"
        }, {
          "name": "VendorID",
          "type": "geojson",
          "format": "default"
        }, {
          "name": "Vendor",
          "type": "string",
          "format": "default"
        }, {
          "name": "AccountCode",
          "type": "geojson",
          "format": "default"
        }, {
          "name": "AccountDescription",
          "type": "string",
          "format": "default"
        }, {
          "name": "DocNo",
          "type": "geojson",
          "format": "default"
        }, {
          "name": "Amount",
          "type": "integer",
          "format": "default"
        }, {
          "name": "Date",
          "type": "integer",
          "format": "default"
        }, {"name": "Source", "type": "integer", "format": "default"}]
      },
      "url": "http://raw.githubusercontent.com/rgrp/dataset-gla/master/data/all.csv",
      "format": "csv",
      "mediatype": "text/csv"
    }, {
      "name": "all.csv",
      "schema": {
        "fields": [{
          "name": "ID",
          "type": "integer",
          "format": "default"
        }, {
          "name": "VendorID",
          "type": "geojson",
          "format": "default"
        }, {
          "name": "Vendor",
          "type": "string",
          "format": "default"
        }, {
          "name": "AccountCode",
          "type": "geojson",
          "format": "default"
        }, {
          "name": "AccountDescription",
          "type": "string",
          "format": "default"
        }, {
          "name": "DocNo",
          "type": "geojson",
          "format": "default"
        }, {
          "name": "Amount",
          "type": "integer",
          "format": "default"
        }, {
          "name": "Date",
          "type": "integer",
          "format": "default"
        }, {"name": "Source", "type": "integer", "format": "default"}]
      },
      "path": "all.csv",
      "format": "csv",
      "mediatype": "text/csv"
    }]
  };

  it('good datapackage.json', function (done) {
    this.timeout(10000);
    tools.validate(data).then(function (O) {
      assert.equal(O.valid, true);
      assert.equal(O.errors.length, 0);
      done();
    });
  });
  it('bad datapackage.json', function (done) {

    this.timeout(10000);
    var badData = JSON.parse(JSON.stringify(data));//Deep clone
    badData.name = 3342;
    tools.validate(badData).then(function (O) {
      assert.equal(O.valid, false);
      assert.equal(O.errors.length, 1);
      done();
    });
  });
});
