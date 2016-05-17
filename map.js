var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([width / 2, height / 2]);

var start_scale = isMobile? 0.5 : 1;
var reset_zoom = isMobile? [94.5040054321289, 175.3100128173828] : [0,0]

var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(start_scale)
    .scaleExtent([start_scale, 8])
    .on("zoom", zoomed);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("click", stopped, true);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", reset);

var g = svg.append("g");

svg
    .call(zoom) // delete this line to disable free zooming
    .call(zoom.event);

d3.json("data/us.json", function(error, us) {
if (error) throw error;

g.append("g")
  .attr("id", "states")
.selectAll("path")
  .data(topojson.feature(us, us.objects.states).features)
.enter().append("path")
  .attr("d", path)
  .on("click", clicked)
  .on("mouseover",hovered)
  .on("mouseout", un_hovered)

g.append("path")
  .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
  .attr("id", "state-borders")
  .attr("d", path)
});

function hovered(d){
d3.select(this)
    .attr("fill", "steelblue")
}

function un_hovered(d){
d3.select(this)
    .attr("fill", "#aaa")
}

function clicked(d) {
if (active.node() === this) return reset();
active.classed("active", false);
active = d3.select(this).classed("active", true);
currentState = stateKeys[d.id]
dateSelector()
// drawTree(stateKeys[d.id])

var bounds = path.bounds(d),
  dx = bounds[1][0] - bounds[0][0],
  dy = bounds[1][1] - bounds[0][1],
  x = (bounds[0][0] + bounds[1][0]) / 2,
  y = (bounds[0][1] + bounds[1][1]) / 2,
  scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
  translate = [width / 2 - scale * x, height / 2 - scale * y];

svg.transition()
  .duration(750)
  .call(zoom.translate(translate).scale(scale).event);
}

function reset() {
    d3.select(".treeViz").remove()
    d3.select(".inSeasonViz").remove()
    active.classed("active", false);
    active = d3.select(null);

    svg.transition()
      .duration(750)
      .call(zoom.translate(reset_zoom).scale(start_scale).event);
}

function zoomed() {
    g.style("stroke-width", 1.5 / d3.event.scale + "px");
    g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    console.log(d3.event.translate)
}

if(isMobile){
    svg.call(zoom.translate(reset_zoom).scale(start_scale).event);
}


// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
if (d3.event.defaultPrevented) d3.event.stopPropagation();
}
