datapackage-validate
====================

Validate [Data Package][] datapackage.json files.

[Data Package]: http://data.okfn.org/doc/data-package

# Installation

[![NPM](https://nodei.co/npm/datapackage-validate.png)](https://nodei.co/npm/datapackage-validate/)

```
npm install datapackage-validate
```

# Usage

Following assume you've imported the module as follows:

```
var validator = require('datapackage-validate');
```

## validate

Validate the provided DataPackage.json file

```
validator.validate(string)
```

* `string`: datapackage.json string or object to validate (note method will
  take care of parsing the string and checking it is valid JSON if it is not
  parsed already)

Note the method is synchronous and returns a JS object with following
structure:

```
{
  valid: true | false,
  errors: [
    {
      // every error has a message
      message: 'Invalid JSON: ...'
      // JSON errors come from json-lint and will also have
      line: 
    },
    {
      message: 'Array is too short (0), minimum 1',
      // schema errors come from schema validator and include additiona
      // path in input JSON
      dataPath: '/resources',
      // path in schema
      schemaPath: '/properties/resources/minItems',
    },
    ...
  ]
  warnings: [
    {
      message: 'No title field'
    },
    ...
  ]
};
```


## validateUrl

Convenience method to validate a DataPackage.json file at a URL. Uses
validate but also checks file is accessible return errors in correct
format.

```
validator.validateUrl(url, callback)
```

* `url`: path to DataPackage.json

Note callback just has a single argument which is the validation result.

# Changelog

* v0.2.0: #1, #2, #4 (jsonlint, much better schema validation using official schemas)
* v0.1.0: first working release

