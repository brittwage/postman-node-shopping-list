var http = require('http')
var url = require('url')
var items = []

// HTTP REQUEST
// localhost:9000
// tail: /
// data: bacon
// verb: POST

var server = http.createServer(function(req, res){
  // POST - Create
  // GET - Read
  // PUT - Update
  // DELETE - Destroy
  var deleteItem = function(index){
    items.splice(index, 1)
  }
  switch (req.method) {
    case 'POST':
      // the client sends data to the server manifesting in the `req` object
      // the server must extract the data from this object and CREATE a new
      // item in the `items` array
      var item = ''
      // for every data event of the `req` parameter object we append the string 
      // chunk to the string stored in the variable item
      req.on('data', function(chunk){
        item += chunk
      })
      // on the end event of the `req` object
      req.on('end', function(){
        items.push(item)
        res.end(item + ' added\n')
      })
      break

    case 'GET':
      // the client must READ data from the items array
      // thus, the server must iterate over the data in the items
      // aray and write this to the response object
      items.forEach(function(item, index){
        res.write('BEGIN')
        res.write(index + '. ' + item + '\n')
      })
      res.end('END')
      break

    case 'DELETE':
      // delete an item at a given index in the `items` array
      // get index from url
      var index = url.parse(req.url).path.substring(1)
      var itemName = items[index]
      deleteItem(index)
      res.end(itemName + ' at index ' + index + ' deleted\n')
      break

    case 'PUT':
      // get index from url string stored in req.url
      var index = url.parse(req.url).path.substring(1)
      // get new item name from the data sent in the `req` object
      var item = ''
      req.on('data', function(chunk){
        item += chunk
      })
      req.on('end', function(){
        // set index `index` of array `items` to `item`
        var initialItem = items[index]
        items[index] = item
        res.end('Item ' + initialItem + ' at index ' + index
           + ' replaced with item ' + item)
      })
      break
  }
})

server.listen(9000, function(){
  console.log('listening on 9000')
})