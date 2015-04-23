// TODO rewrite this using pipe
var http = require('http')
var url = require('url')
var join = require('path').join

var fs = require('fs')
var qs = require('querystring')
var items = []

var root = __dirname

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
      req.setEncoding('utf8')
      req.on('data', function(chunk){
        item += chunk
      })
      // on the end event of the `req` object
      req.on('end', function(){
        var obj = qs.parse(item)
        items.push(obj.item)
        res.end(obj.item + ' added\n')
        res.end()
      })
      break

    case 'GET':
      if (req.url === '/input'){
        // var url = url.parse(req.url)
        var filePath = join(root, 'index.html')
        var fileStream = fs.createReadStream(filePath)
        fileStream.pipe(res)
        fileStream.on('error', function(err){
          res.statusCode = 500
          res.end('Internal Server Error')
        })
        break

      } else {
        // the client must READ data from the items array
        // thus, the server must iterate over the data in the items
        // aray and write this to the response object
        res.write('<!DOCTYPE html>\n<html lang="en">\n<body>')
        res.write('<ul>')
        items.forEach(function(item, index){
          res.write('<li>' + item + '</li>')
        })
        res.end('</ul>\n</body>\n</html>')
        break
      }

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