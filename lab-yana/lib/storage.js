'use strict';

const storage = {}; //need this object to store info for our requests

module.exports = exports = {};

exports.createItem = function(schemaName, item) {
  if (!schemaName) return Promise.reject(new Error('expected schema name'));
  if (!item) return Promise.reject(new Error('expected item'));
  if (!storage[schemaName]) storage[schemaName] = {}; //if storage doesn't already contain info about this item, make it
  storage[schemaName][item.id] = item; //assign info passed in from item to storage
  return Promise.resolve(item);
}

exports.fetchItem = function(schemaName, id) {
  return new Promise((resolve, reject) => {
    if (!schemaName) return reject(new Error('expected schema name'));
    if (!id) return reject(new Error('expected id'));
    let schema = storage[schemaName]; //assign the info from storage to a variable
    if (!schema) return reject(new Error('schema not found')); //trying to fetch something that doesn't exist
    let = item = schema[id];
    if (!item) return reject(new Error('item not found'));
    resolve(item); //just in case we got past the four if statemets
  });
}