'use strict';

const storage = require('../lib/storage.js');
const response = require('../lib/response.js'); //to use the sendJSON and sendText methods
const Blog = require('../model/blog-entry.js');

module.exports = function(router) { //a Router object is instantiated in server js, then this function is called with that object being passed in as a parameter

  router.get('api/blog', function(req, res) {
    if (req.url.query.id) {
      console.log("REQUEST:", req.url.query);
      storage.fetchItem('blog', req.url.query.id)
      .then(blog => { response.sendJSON(res, 200, blog); }  )
      .catch(err => {
        console.error(err);
        response.sendText(res, 404, 'not found');
      });
      return;
    }
    storage.fetchList('blog')
    .then(list => { response.sendJSON(res, 200, list); } )
    .catch(err => {
      console.error(err);
      response.sendText(res, 404, 'not found');
    });
    return;
  });

  router.post('api/blog', function(req, res) {
    try {
      var blog = new Blog(req.body.name, req.body.content); //need these two parameters for object properties, then id is generated by constructor
      storage.createItem('blog', blog); //make the item
      response.sendJSON(res, 200, blog); //send success response
    } catch(err) {
      console.error(err);
      response.sendText(res, 400, 'bad request'); //send failure response
    }
  });

  router.delete('api/blog', function(req, res) {
    try {
      storage.deleteItem('blog', req.url.query.id);
      response.sendText(res, 204, 'blog entry deleted');
    } catch(err) {
      console.error(err);
      response.sendText(res, 404, 'blog entry not found');
    }
    response.sendText(res, 400, 'bad request');
  });
  // router.put('api/blog', function(res, req) {
  //
  // });
};