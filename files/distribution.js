
var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    distributionHeight = 300 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([distributionHeight, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
  })

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", distributionHeight + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

// DRAWING THE AXES, ONLY NECESSARY ONCE
x.domain([0,1000]);
y.domain([0,1]);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + distributionHeight + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Frequency");

var paintDistribution = function(data) {
  if (data.length > 0){
    // data = d3.range(500)
    // console.log(data)
    svg.selectAll(".bar").remove();

    filteredData = d3.layout.histogram()
      .bins(x.ticks(20))
      (data);

    filteredData.forEach(function(d){d.frequency = d.y / data.length})

    svg.selectAll(".bar")
        .data(filteredData)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.x)+2; })
        .attr("width", function(d) {return x(d.dx)-4})
        .attr("y", function(d) { return y(d.y / data.length); })
        .attr("height", function(d) { return distributionHeight - y(d.frequency) - 1; })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
  }
}

d3.tsv("data.tsv", type, function(error, data) {
  paintDistribution(data); 
});

function type(d) {
  d.frequency = +d.frequency;
  return d;
}
