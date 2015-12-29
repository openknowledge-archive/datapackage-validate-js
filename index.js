var url = require('url')
  , fs = require('fs')
  , jsonlint = require('json-lint')
  , path = require('path')
  , tv4 = require('tv4')
  , request = require('request')  
  , Promise = require('bluebird')
  , _ = require('underscore')
  , registry = require('datapackage-registry')
  , url = require("url")
  ;

function getDefinitionUrl(schemaUrl) {
  var urlComponents = url.parse(schemaUrl);
  var tempArray = urlComponents.pathname.split('/');
  tempArray.pop();
  tempArray.push('definitions.json');
  urlComponents.search = '';
  urlComponents.pathname  = tempArray.join('/');
  return url.format(urlComponents);
}

exports.validate = function(raw, schema) {
  var json = raw;

  // Default schema id
  var schemaID = schema || 'base';

  if (typeof(json) == 'string') {
    var lint = jsonlint(json);
    if (lint.error) {
      return new Promise(function(RS, RJ) { RS({
        valid: false,
        errors: [
          {
            message: 'Invalid JSON: ' + lint.error,
            type: 'json',
            line: lint.line,
            character: lint.character
          }
        ]
      
      }); })
    }
    json = JSON.parse(raw);
  }

  // For consistency reasons always return Promise
  return (new Promise(function(RS, RJ) {
    if(_.isObject(schema) && !_.isArray(schema) && !_.isFunction(schema)) {
      RS(tv4.validateMultiple(json, schema));
      return null;
    }

    // If schema passed as id — get registry schema by id and validate against it
    registry.get().then(function(R) {
      var profile = _.findWhere(R, {id: schemaID});

      if(!profile) {
        RJ('No profile found with id ' + schemaID);
        return null;
      }

      var definitionUrl = getDefinitionUrl(profile.schema);
      request(definitionUrl, function(error, response, body){
        if(error) {
          RJ('Failed loading definition file from ' + definitionUrl);
          return null;
        }
        request(profile.schema, function(E, R, B) {
          if(E) {
            RJ('Failed loading schema from ' + profile.schema);
            return null;
          }

          try {
            tv4.addSchema("definitions.json", JSON.parse(body));

            RS(tv4.validateMultiple(json, JSON.parse(B)));
          } catch(E) {
            RJ('Failed parsing schema json from ' + profile.schema);
          }
        });

      });
    }, function() { RJ('Registry request failed') });
  })).then(function(R) {
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
