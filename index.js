var url = require('url')
  , fs = require('fs')
  , jsonlint = require('json-lint')
  , path = require('path')
  , tv4 = require('tv4')
  , request = require('request')  
  , Promise = require('promise-polyfill')
  , _ = require('underscore')
  ;

exports.validate = function(raw, schema) {
  var json = raw;
  if (typeof(json) == 'string') {
    var lint = jsonlint(json);
    if (lint.error) {
      return {
        valid: false,
        errors: [
          {
            message: 'Invalid JSON: ' + lint.error,
            type: 'json',
            line: lint.line,
            character: lint.character
          }
        ]
      };
    }
    json = JSON.parse(raw);
  }

  // For consistency reasons always return Promise
  return new Promise(function(RS, RJ) {
    if(_.isObject(schema) && !_.isArray(schema) && !_.isFunction(schema))
      RS(tv4.validateMultiple(json, schema));
  }).then(function(R) {
    var errors = R.errors.map(function(error) {
    delete error.stack;
    error.type = 'schema';
    return error;
  });
  if (errors.length === 0) {
    return {
      valid: true,
      errors: []
    };
  } else {
    return {
      valid: false,
      errors: errors
    };
  }
  });
}

exports.validateUrl = function(dpurl, callback) {
  request(dpurl, function(err, response, body) {
    if (err) {
      callback({
        valid: false,
        errors: [{
          message: err.toString()
        }]
      });
    }
    else if (response.statusCode !== 200) {
      callback({
        valid: false,
        errors: [{
          message: 'Error loading the datapackage.json file. HTTP Error code: ' + response.statusCode
        }]
      });
    } else {
      callback(exports.validate(body));
    }
  });
}


