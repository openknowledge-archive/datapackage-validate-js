var JSV = require("JSV").JSV
  , url = require('url')
  , request = require('request')  
  ;

var dpSchema = {
  "title": "Data Package",
  "type" : "object",
  "properties": {
    name: {
      type: 'string',
      required: true
    },
    title: {
      type: 'string'
    },
    sources: {
      type: 'array'
    },
    licenses: {
      type: 'array'
    },
    resources: {
      type: 'array',
      required: true
    } 
  }
};

exports.validate = function(raw) {
  var env = JSV.createEnvironment();
  try {
    var json = JSON.parse(raw);
  } catch(e) {
    return { valid: false, errors: [{message: 'Invalid JSON'}]};
  }
  var required = [ 'name', 'resources' ];
  var recommended = [
    'title',
    'licenses',
    'datapackage_version',
    'description',
    'sources',
    'keywords'
  ];
  var report = env.validate(json, dpSchema);
  var errors = report.errors;
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


