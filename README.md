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

* `string`: datapackage.json string to validate (note method will take
  care of parsing the string and checking it is valid JSON)

Note the method is synchronous and returns a JS object with following structure:

```
{
  valid: true | false,
  errors: [
    {
      message: 'Invalid JSON'
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
validator.validate(url, callback)
```

* `url`: path to DataPackage.json

Note callback just has a single argument which is the validation result.

