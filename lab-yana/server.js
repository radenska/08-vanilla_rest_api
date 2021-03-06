'use strict';

const PORT = 3002;
const http = require('http');
const Blog = require('./model/blog-entry.js');
const Router = require('./lib/router.js');
const storage = require('./lib/storage.js');
const router = new Router(); //instantiate a new Router obj

router.delete('/api/blog', function(req, res) {
  if(req.url.query.id) {
    storage.deleteItem('blog', req.url.query.id)
    .then( () => {
      res.writeHead(204);
      res.end();
    })
    .catch(err => {
      console.error(err);
      res.writeHead(404, { 'Content-Type': 'text/plain' } );
      res.write('not found');
      res.end();
    });
    return;
  }
  res.writeHead(400, { 'Content-Type': 'text/plain' } );
  res.write('bad request');
  res.end();
});

router.get('/api/blog', function(req, res) { //router.get is a prototype function of every Router object
  if (req.url.query.id) { //if the request contains an id
    storage.fetchItem('blog', req.url.query.id) //calls the fetchItem fx in storage module, passing it 'blog' string and the query id to retrieve the item from the storage object
    .then(blog => { //after above is done, call a function that passes in "blog", which is the fulfilled Promise object from fetchItem
      res.writeHead(200, { 'Content-Type': 'application/json' } ); //type is app/json because you are writing the JSON from the req
      res.write(JSON.stringify(blog)); //write the info fetched from storage in the response
      res.end();
    })
    .catch(err => { //if Promise was rejected
      console.error(err);
      res.writeHead(404, { 'Content-Type': 'text/plain' } );
      res.write('not found');
      res.end();
    });
    return; //make sure you exit function if you're in the if so the code below doesn't run
  }
  storage.fetchList('blog') //if no id provided for GET request, fetch list of IDs of stored blog entries
    .then(blog => {
      res.writeHead(200, { 'Content-Type': 'application/json' } );
      res.write(JSON.stringify(blog));
      res.end();
    })
    .catch(err => {
      console.error(err);
      res.writeHead(404, { 'Content-Type': 'text/plain' } );
      res.write('not found');
      res.end();
    });
  // res.writeHead(400, { 'Content-Type': 'text/plain' } ); //if there is no id, run this because you're trying to GET something that is not in storage
  // res.write('bad request');
  // res.end();
});

router.post('/api/blog', function(req, res) {
  try {
    var blog = new Blog(req.body.name, req.body.content); //creates new Blog object, passing in the name and content (blog entry)
    storage.createItem('blog', blog); //fx that puts the blog entry into storage object
    res.writeHead(200, { 'Content-Type': 'application/json' } );
    res.write(JSON.stringify(blog));
    res.end();
  } catch (err) {
    console.error(err);
    res.writeHead(400, { 'Content-Type': 'text/plain' } );
    res.write('bad request');
    res.end();
  }
});


const server = http.createServer(router.route()); //route() parses the url and body of a request and calls the appropriate method (e.g., GET)

server.listen(PORT, () => { console.log('server up', PORT); } );
