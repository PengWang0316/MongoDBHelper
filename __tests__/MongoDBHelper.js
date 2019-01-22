import log from '@kevinwang0316/log';
import mongodb from 'mongodb';

import * as MongoDBHelper from '../src/MongoDBHelper';

const mockConnection = { dbName: 'mydb' };
const mockDb = jest.fn().mockReturnValue(mockConnection);
const mockClick = { db: mockDb };

jest.mock('@kevinwang0316/log', () => ({ debug: jest.fn(), error: jest.fn() }));
// jest.mock('mongodb', () => ({ MongoClient: { connect: jest.fn().mockReturnValue({ db: jest.fn().mockReturnValue({ dbName: 'mydb' }) }) } }));
jest.mock('mongodb', () => ({ MongoClient: { connect: jest.fn().mockImplementation(() => mockClick) } }));

describe('MongoDBHelper Test', () => {
  beforeEach(() => {
    log.debug.mockClear();
    log.error.mockClear();
    mockDb.mockClear();
    mongodb.MongoClient.connect.mockClear();
  });

  test('initialConnects dbs undefined with error', async () => {
    mongodb.MongoClient.connect.mockRejectedValueOnce('error message');
    await MongoDBHelper.initialConnects('dbUrl', 'dbName');

    expect(log.debug).toHaveBeenCalledTimes(1);
    expect(log.debug).toHaveBeenLastCalledWith('Initializing a new db connection...');
    expect(log.error).toHaveBeenCalledTimes(1);
    expect(log.error).toHaveBeenLastCalledWith('Unable to connect to the mongoDB server. Error:', 'error message');
    expect(mongodb.MongoClient.connect).toHaveBeenCalledTimes(1);
    expect(mongodb.MongoClient.connect).toHaveBeenLastCalledWith('dbUrl', { useNewUrlParser: true, poolSize: 1 });
    expect(mockDb).not.toHaveBeenCalled();
  });

  test('initialConnects dbs undefined without error', async () => {
    await MongoDBHelper.initialConnects('dbUrl', 'dbName');

    expect(log.debug).toHaveBeenCalledTimes(1);
    expect(log.debug).toHaveBeenLastCalledWith('Initializing a new db connection...');
    expect(log.error).not.toHaveBeenCalled();
    expect(mongodb.MongoClient.connect).toHaveBeenCalledTimes(1);
    expect(mongodb.MongoClient.connect).toHaveBeenLastCalledWith('dbUrl', { useNewUrlParser: true, poolSize: 1 });
    expect(mockDb).toHaveBeenCalledTimes(1);
    expect(mockDb).toHaveBeenLastCalledWith('dbName');
  });

  test('initialConnects dbs defined with error', async () => {
    await MongoDBHelper.initialConnects('dbUrl', 'dbName');
    expect(log.debug).not.toHaveBeenCalled();
    expect(log.error).not.toHaveBeenCalled();
    expect(mockDb).not.toHaveBeenCalled();
    expect(mongodb.MongoClient.connect).not.toHaveBeenCalled();
  });

  test('getDB', () => {
    expect(MongoDBHelper.getDB()).toBe(mockConnection);
  });

  test('promiseFindResult without error', async () => {
    const result = 'result';
    const mockToArray = jest.fn().mockImplementation(cb => cb(null, result));
    const callback = jest.fn().mockReturnValue({ toArray: mockToArray });

    const fnResult = await MongoDBHelper.promiseFindResult(callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith(mockConnection);
    expect(mockToArray).toHaveBeenCalledTimes(1);
    expect(fnResult).toBe(result);
  });

  test('promiseFindResult with error', async () => {
    const result = 'result';
    const mockToArray = jest.fn().mockImplementation(cb => cb('error message', result));
    const callback = jest.fn().mockReturnValue({ toArray: mockToArray });

    try {
      await MongoDBHelper.promiseFindResult(callback);
    } catch (error) {
      expect(error).toBe('error message');
    }
  });

  test('promiseNextResult without error', async () => {
    const result = 'result';
    const mockNext = jest.fn().mockImplementation(cb => cb(null, result));
    const callback = jest.fn().mockReturnValue({ next: mockNext });

    const fnResult = await MongoDBHelper.promiseNextResult(callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith(mockConnection);
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(fnResult).toBe(result);
  });

  test('promiseNextResult with error', async () => {
    const result = 'result';
    const mockNext = jest.fn().mockImplementation(cb => cb('error message', result));
    const callback = jest.fn().mockReturnValue({ next: mockNext });

    try {
      await MongoDBHelper.promiseNextResult(callback);
    } catch (error) {
      expect(error).toBe('error message');
    }
  });

  test('promiseInsertResult without error', async () => {
    const mockThen = jest.fn().mockImplementation(cb => cb());
    const callback = jest.fn().mockReturnValue({ then: mockThen });

    await MongoDBHelper.promiseInsertResult(callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith(mockConnection);
    expect(mockThen).toHaveBeenCalledTimes(1);
  });

  test('promiseReturnResult without error', async () => {
    const returnValue = 'returnValue';
    const callback = jest.fn().mockReturnValue(returnValue);

    const result = await MongoDBHelper.promiseReturnResult(callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith(mockConnection);
    expect(result).toBe(returnValue);
  });
});
