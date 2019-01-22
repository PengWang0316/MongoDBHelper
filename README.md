# MongoDB Helper

A MongoDB helper allows using MongoDB easier.  

[![Build Status](https://travis-ci.org/PengWang0316/MongoDBHelper.svg?branch=master)](https://travis-ci.org/PengWang0316/MongoDBHelper)
[![Coverage Status](https://coveralls.io/repos/github/PengWang0316/MongoDBHelper/badge.svg?branch=master)](https://coveralls.io/github/PengWang0316/MongoDBHelper?branch=master)

# Installing

```
npm install --save @kevinwang0316/mongodb-helper
```

# Usage

```javascript
import { initialConnects, getDB, promiseFindResult } from '@kevinwang0316/mongodb-helper';
// For NodeJS
// const { initialConnects, getDB, promiseFindResult } = require(''@kevinwang0316/mongodb-helper'');

// Initialize your connection before use it. The connection pool will be saved in a global
await initialConnects('database url', 'database name', 1);

// use promiseFindresult
const result = await promiseFindResult(db => db
  .collection('collection name')
  .find({});

// use db directly
const result = getDB().collection('collection name')
  .insert({}, (err, response) => {
    if (err) reject(err);
    resolve(response.ops[0]);
  });
```


# Log Configuration

The [@kevinwang0316/log](https://www.npmjs.com/package/@kevinwang0316/log) library is using

If you want to change the defual log level (debug):

Add a log_level variable to your .env file.
Or if you are using Fass solution such as AWS Lambda, set up the log_level to your environment.

Log all level of information (debug, info, warn, error)
log_level=DEBUG

Log info and above levels of information (info, warn, error)
log_level=INFO

Log warn and above levels of information (warn, error)
log_level=WARN

Log just error level of information (error)
log_level=ERROR

# License

Log is licensed under MIT License - see the [License file](https://github.com/PengWang0316/MongoDBHelper/blob/master/LICENSE).
