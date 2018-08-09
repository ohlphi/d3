var http = require('http');
var D3Node = require('d3-node');
var d3n = new D3Node();

http.createServer(function(req, res) {
  if(req.url.indexOf('favicon.ico') != -1) {
    res.statusCode = 404;
    return;
  }

  d3n.createSVG(400, 400)
     .append('circle')
     .attr('r', 200)
     .attr('cx', 200)
     .attr('cy', 200);

  res.writeHead(200, {
    'Content-Type': 'image/svg+xml'

  });

  res.end(d3n.svgString());
}).listen(3333);
