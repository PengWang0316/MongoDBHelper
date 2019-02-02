import { MongoClient } from 'mongodb';
import log from '@kevinwang0316/log';

let dbs; // Save dbs to a global variable for reusing

// Initializing the connection pool.
export const initialConnects = async (dbUrl, dbName, poolSize = 1) => {
  if (!dbs) { // Initialize the database connect if dbs has not been exsit
    log.debug('Initializing a new db connection...');
    try {
      // Since every container will not interact with others, pool size should be just 1
      const client = await MongoClient.connect(dbUrl, { useNewUrlParser: true, poolSize });
      dbs = client.db(dbName);
    } catch (e) {
      log.error('Unable to connect to the mongoDB server. Error:', e);
    }
  }
};

export const getDB = () => dbs;

/* Using Promise to wrap connection and toArray */
export const promiseFindResult = callback => new Promise((resolve, reject) => callback(dbs)
  .toArray((err, result) => {
    if (err) reject(err);
    else resolve(result);
  }));

export const promiseNextResult = callback => new Promise((resolve, reject) => callback(dbs)
  .next((err, result) => {
    if (err) reject(err);
    else resolve(result);
  }));

export const promiseInsertResult = callback => new Promise((resolve, reject) => callback(dbs)
  .then(result => resolve()));

export const promiseReturnResult = callback => new Promise((resolve, reject) => resolve(callback(dbs)));
