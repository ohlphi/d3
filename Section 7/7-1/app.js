// Width and height
var chart_width     =   800;
var chart_height    =   600;
var color = d3.scaleQuantize().range([
  'rgb(255,245,240)', 'rgb(254,224,210)', 'rgb(252,187,161)',
  'rgb(252,146,114)', 'rgb(251,106,74)', 'rgb(239,59,44)',
  'rgb(203,24,29)', 'rgb(165,15,21)', 'rgb(103,0,13)'
]);

// Projection
var projection = d3.geoAlbersUsa()
  .translate([0,0]);

var path = d3.geoPath(projection);
  // .projection(projection);


// Create SVG
var svg             =   d3.select("#chart")
    .append("svg")
    .attr("width", chart_width)
    .attr("height", chart_height);

var zoom_map = d3.zoom()
  .scaleExtent([0.5, 3.0])
  .translateExtent([
    [-1000, -500],
    [1000, 500]
  ])
  .on('zoom', function() {
  // console.log(d3.event);
  var offset = [
    d3.event.transform.x,
    d3.event.transform.y
  ];
  var scale = d3.event.transform.k * 2000;

  projection.translate(offset)
    .scale(scale);

  svg.selectAll('path')
     .transition()
     .attr('d', path);

  svg.selectAll('circle')
     .transition()
     .attr('cx', function(d) {
       return projection([d.lon, d.lat])[0];
     })
     .attr('cy', function(d) {
       return projection([d.lon, d.lat])[1];
     });
});

var map = svg.append('g')
  .attr('id', 'map')
  .call(zoom_map)
  .call(
    zoom_map.transform,
    d3.zoomIdentity
        .translate(chart_width / 2, chart_height / 2)
        .scale(1)
  );

map.append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', chart_width)
  .attr('height', chart_height)
  .attr('opacity', 0);

// Data
d3.json('zombie-attacks.json').then(function(zombie_data){
  color.domain([
    d3.min(zombie_data, function(d) {
      return d.num;
    }),
    d3.max(zombie_data, function(d) {
      return d.num;
    })
  ]);
  d3.json('us.json').then(function(us_data) {
    us_data.features.forEach(function(us_e, us_i) {
      zombie_data.forEach(function(z_e, z_i) {
        if(us_e.properties.name !== z_e.state) {
          return null;
        }

        us_data.features[us_i].properties.num = parseFloat(z_e.num);
      });
    });

    // console.log(us_data);

    map.selectAll('path')
       .data(us_data.features)
       .enter()
       .append('path')
       .attr('d', path)
       .attr('fill', function(d) {
         var num  = d.properties.num;
         return num ? color(num) : '#ddd';
       })
       .attr('stroke', '#fff')
       .attr('stroke-width', 1);

    draw_cities();
  });
});

function draw_cities(){
  d3.json('us-cities.json').then(function(city_data) {
    map.selectAll('circle')
       .data(city_data)
       .enter()
       .append('circle')
       .style('fill', '#9D497A')
       .style('opacity', 0.8)
       .attr('cx', function(d) {
         return projection([d.lon, d.lat])[0];
       })
       .attr('cy', function(d) {
         return projection([d.lon, d.lat])[1];
       })
       .attr('r', function(d) {
         return Math.sqrt(parseInt(d.population) * 0.00005);
       })
       .append('title')
       .text(function(d) {
         return d.city;
       });
  });
};

d3.selectAll('#buttons button.panning').on('click', function(){
    var distance = 100;
    var direction = d3.select(this).attr('class').replace('panning ', '');
    var x = 0;
    var y = 0;

    if(direction == "up") { // Increase y offset
      y += distance;
    }else if(direction == "down") { // Decrease y offset
      y -= distance;
    }else if(direction == "left") { // Increase x offset
      x += distance;
    }else if(direction == "right") { // Decrease x offset
      x -= distance;
    }

    map.transition()
       .call(zoom_map.translateBy, x, y);
  });

  d3.selectAll('#buttons button.zooming').on('click', function(){
      var scale = 1;
      var direction = d3.select(this).attr('class').replace('zooming ', '');

      if(direction == "in") { //
        scale = 1.25;
      }else if(direction == "out") { // Decrease y offset
        scale = 0.75;
      }

      map.transition()
         .call(zoom_map.scaleBy,scale);
    });
