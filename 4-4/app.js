// var data            =   [
//     [ 400, 200 ],
//     [ 210,140 ],
//     [ 722,300 ],
//     [ 70,160 ],
//     [ 250,50 ],
//     [ 110,280 ],
//     [ 699,225 ],
//     [ 90, 220 ]
// ];




var chart_width     =   800;
var chart_height    =   400;
var padding = 50;
var data = [
  {date: '07/01/2017', num:20},
  {date: '07/02/2017', num:37},
  {date: '07/03/2017', num:25},
  {date: '07/04/2017', num:45},
  {date: '07/05/2017', num:23},
  {date: '07/06/2017', num:33},
  {date: '07/07/2017', num:49},
  {date: '07/08/2017', num:40},
  {date: '07/09/2017', num:36},
  {date: '07/10/2017', num:27}
];

var time_parse = d3.timeParse('%m/%d/%Y');
var time_format = d3.timeFormat('%b %e');

// Loop through each date:
data.forEach(function(e, i) {
  data[i].date = time_parse(e.date);
});

// Create SVG element
var svg = d3.select('#chart')
  .append('svg')
  .attr('width', chart_width)
  .attr('height', chart_height);

// Create scales
x_scale = d3.scaleTime()
  .domain([
    d3.min(data, function(d) {
      return d.date;
    }),
    d3.max(data, function(d){
    return d.date;
  })])
  .range([padding, chart_width - padding * 2]);

y_scale = d3.scaleLinear()
  .domain([0, d3.max(data, function(d){
    return d.num;
  })])
  .range([chart_height-padding,padding]);

// var r_scale = d3.scaleLinear()
//   .domain([0, d3.max(data, function(d){
//     return d[1];
//   })])
//   .range([5,30]);

var a_scale = d3.scaleSqrt()
  .domain([0, d3.max(data, function(d){
    return d.num;
  })])
  .range([0,25]);

// Create circles
svg.selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('cx', function(d){
    return x_scale(d.date);
  })
  .attr('cy', function(d){
    return y_scale(d.num);
  })
  .attr('r', function(d) {
    return a_scale(d.num);
  })
  .attr('fill', '#D1AB0E');


// Create labels
svg.selectAll('text')
  .data(data)
  .enter()
  .append('text')
  .text(function(d) {
    return time_format(d.date);
  })
  .attr('x', function(d) {
    return x_scale(d.date);
  })
  .attr('y', function(d) {
    return y_scale(d.num);
  });
