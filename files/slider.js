function figure(width, height, margin){
  
  if (margin===undefined){
    margin = {
      left: width/20,
      right: width/20,
      top: height/20,
      bottom: height/20
    }
  }

  this.width = width - margin.left - margin.right
  this.height = height - margin.top - margin.bottom

  this.Xscale = d3.scale.linear().range([0, this.width])
  this.Yscale = d3.scale.linear().range([this.height, 0])
  this.Zscale = d3.scale.linear().range(["green", "red"])

  this.appendTo = appendTo;
  function appendTo(CSS_Selector){
    
    this.svg = d3.selectAll(CSS_Selector).append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox","0 0 "+width+" "+height)
      .attr("preserveAspectRatio","xMinyMin meet")

    this.svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("class","main")

    return this
  }
}

var SLIDER = new figure(800,45).appendTo("#slider")

// Setting up the slider

SLIDER.background = SLIDER.svg.select("g").append("rect")
  .attr({y: 25, height:10, width: (SLIDER.width), fill: "grey", stroke: "white", ry:5})

SLIDER.slider = SLIDER.svg.select("g").append("rect")
  .attr({x: 0, height:20, width:10, fill:"black", rx:5})
  .attr("transform", "translate(-5,20)")

SLIDER.text = SLIDER.svg.select("g").append("text")
  .attr({y: 15})
  .style("font", "16px sans-serif")
  .text("Simulation Time (sec)")

SLIDER.slidescale = d3.scale.linear().domain([0,SLIDER.width]).range([0,SLIDER.width]).clamp(true);
SLIDER.timescale = d3.scale.linear().domain([0,SLIDER.width]).range([120,7200])
var timeBisect = d3.bisector(function(d){return d.time}).left

SLIDER.drag = d3.behavior.drag()
  .on("drag", function(){
    SLIDER.slider.attr("x",SLIDER.slidescale(d3.mouse(this)[0]))
    
    //update ALL the figures
   
    
    //update the text
    SLIDER.text.text("Simulation Time (sec): " + t)
  })

SLIDER.slider.call(SLIDER.drag)