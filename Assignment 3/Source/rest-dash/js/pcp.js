var margin = {top: 50, right: 30, bottom: 25, left: -35},
    width = 925 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

var pcpX = d3.scale.ordinal().rangePoints([0, width], 1),
    pcpY = {},
    dragging = {};

var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;

var pcpSVG = d3.select("#pcp")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Tooltip description
var tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("opacity", 0);

var userData;
var restData;
var ratingData;

var chosenRestAttr;
var chosenConsAttr;

var selectRestData = [ 
	{ "text" : "price", "type" : "text" },
	{ "text" : "restCuisine", "type" : "text" },
	{ "text" : "placeID", "type" : "text" },
	{ "text" : "alcohol", "type" : "text" },
	{ "text" : "accessibility", "type" : "text" },
	{ "text" : "Rambience", "type" : "text" },
	{ "text" : "smoking_area", "type" : "text" },
	{ "text" : "dress_code", "type" : "text" },
	{ "text" : "franchise", "type" : "text" },
]
var selectConsData = [ 
	{ "text" : "budget", "type" : "text" },
	{ "text" : "consCuisine", "type" : "text" },
	{ "text" : "birth_year", "type" : "number" },
	{ "text" : "smoker", "type" : "text" },
	{ "text" : "weight", "type" : "number" },
	{ "text" : "height", "type" : "number" },
	{ "text" : "drink_level", "type" : "text" },
	{ "text" : "ambience", "type" : "text" },
	{ "text" : "transport", "type" : "text" },
]

var body = d3.select('body');

function mouseOverArc(d) {
	d3.select(this).attr("stroke","black")

	tooltip.html(function() {return d.userID});
	return tooltip
		.style("opacity", 1)
		.style("top", (d3.event.pageY-10)+"px")
		.style("left", (d3.event.pageX+10)+"px");
}

function mouseOutArc(){
	d3.select(this).attr("stroke","")
	return tooltip.style("opacity", 0);
}

function createSelectionBoxes() {
	// Select Restaurant Variable
	var span = body.append('span')
		.text('Select restaurant variable: ')
	var yInput = body.append('select')
		  .attr('id','xSelect')
		  .on('change',restChange)
		.selectAll('option')
		  .data(selectRestData)
		  .enter()
		.append('option')
		  .attr('value', function (d) { return d.text })
		  .text(function (d) { return d.text ;})
	//body.append('br')
	 
	// Select Consumer Variable
	var span = body.append('span')
		  .text('Select consumer variable: ')
	var yInput = body.append('select')
		  .attr('id','ySelect')
		  .on('change',consChange)
		.selectAll('option')
		  .data(selectConsData)
		  .enter()
		.append('option')
		  .attr('value', function (d) { return d.text })
		  .text(function (d) { return d.text ;})
	body.append('br')
}
	
// update Restaurant axis
function restChange() {
	var value = this.value;
	chosenRestAttr = value;
	updateAxis(selectRestData.isNumeric(value), value);
}
	
// update Consumer axis
function consChange() {
	var value = this.value;
	chosenConsAttr = value;
	updateAxis(selectConsData.isNumeric(value), value);
}

function updateAxis(numericAttribute, value)
{
	foreground.remove();
	background.remove();
	pcpSVG.selectAll(".dimension").remove();
	
	pcpX.domain(dimensions = [chosenRestAttr, "rating", chosenConsAttr]);		
	if(numericAttribute)
	{
		pcpY[value] = d3.scale.linear()
			.domain(d3.extent(mergedList2, function(p) { return +p[value]; }))
			.range([height, 0]);
	}
	else
	{
		pcpY[value] = d3.scale.ordinal()
			.domain(mergedList2.map(function(p) { return p[value]; }))
			.rangePoints([height, 0]);
	}
			
	render();		
}

function render() {
	// Add grey background lines for context.
	  background = pcpSVG.append("g")
		  .attr("class", "background")
		.selectAll("path")
		  .data(mergedList2)
		.enter().append("path")
		  .attr("d", path);

	  // Add blue foreground lines for focus.
	  foreground = pcpSVG.append("g")
		  .attr("class", "foreground")
		.selectAll("path")
		  .data(mergedList2)
		.enter().append("path")
		.attr("class","myLine")
		  .attr("d", path);
		 
	  // Add a group element for each dimension.
	  //console.log(dimensions);
	  var g = pcpSVG.selectAll(".dimension")
		  .data(dimensions)
		.enter().append("g")
		  .attr("class", "dimension")
		  .attr("transform", function(d) { return "translate(" + pcpX(d) + ")"; });
		 
	// Add an axis and title.
	g.append("g")
	  .attr("class", "axis")
	  .each(function(d) { d3.select(this).call(axis.scale(pcpY[d])); })
	.append("text")
	  .style("text-anchor", "middle")
	  .attr("y", -9)
	  .text(function(d) { return d; });

	// Add and store a brush for each axis.
	g.append("g")
	  .attr("class", "brush")
	  .each(function(d) {
		d3.select(this).call(pcpY[d].brush = d3.svg.brush().y(pcpY[d]).on("brushstart", brushstart).on("brush", brush));
	  })
	.selectAll("rect")
	  .attr("x", -8)
	  .attr("width", 16);
}

function position(d) {
  var v = dragging[d];
  return v == null ? pcpX(d) : v;
}

// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function(p) { return [position(p), pcpY[p](d[p])]; }));
}

function brushstart() {
  d3.event.sourceEvent.stopPropagation();
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {				  
  var actives = dimensions.filter(function(p) { return !pcpY[p].brush.empty(); }),
      extents = actives.map(function(p) { return pcpY[p].brush.extent(); });
	  
  var selection = [];
	  
  foreground.style("display", function(d) {
    result = actives.every(function(p, i) {
      // Categorical
      if ( !selectRestData.isNumeric(p) && !selectConsData.isNumeric(p)) {
        return extents[i][0] <= pcpY[p](d[p]) && pcpY[p](d[p]) <= extents[i][1];
      }
      // Numeric
      else {
        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
      }
    });
	
	if(result == true)
	{
		selection[selection.length] = d;		
	}
	
	return result ? null : "none";
  });
  //console.log(selection);
  updateMap(selection);
}

function getCorrectScales(d, mergedList2) {
	if(!selectRestData.isNumeric(d)) { // change the xScale
		return (d == chosenRestAttr || 
		d == "rating" || d == chosenConsAttr) && (pcpY[d] = d3.scale.ordinal()
		.domain(mergedList2.map(function(p) { return p[d]; }))
		.rangePoints([height, 0]));
	}
	else {
		return (d == chosenRestAttr || 
		d == "rating" || d == chosenConsAttr) && (pcpY[d] = d3.scale.linear()
		.domain(d3.extent(mergedList2, function(p) { return +p[d]; }))
		.range([height, 0]));
	}
	if(!selectConsData.isNumeric(d)) { // change the xScale
		return (d == chosenRestAttr || 
		d == "rating" || d == chosenConsAttr) && (pcpY[d] = d3.scale.ordinal()
		.domain(mergedList2.map(function(p) { return p[d]; }))
		.rangePoints([height, 0]));
	}
	else {
		return (d == chosenRestAttr || 
		d == "rating" || d == chosenConsAttr) && (pcpY[d] = d3.scale.linear()
		.domain(d3.extent(mergedList2, function(p) { return +p[d]; }))
		.range([height, 0]));
	}

}

function highlightRatings(ratingSelection)
{
	if(foreground)
	{
		foreground.attr("class", function(d)
		{
			//console.log(ratingSelection);
			//console.log(d);
			if(ratingSelection.indexOf(d) != -1)
				return "selectedLine"; 
			else 
				return "myLine"; 
		});
	}
}

//remove last (invalid) entry from input data
Array.prototype.clean = function() {
  for (var i = 0; i < this.length; i++) {
    if (this[i].Naam == "" || this[i].Naam == undefined) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

Array.prototype.isNumeric = function(attribute){
    for(var i = 0, l = this.length; i < l; ++i){
		if (this[i].text == attribute) {
			if (this[i].type == "number") {
				return true;
			}
			else {
				return false;
			}
		}
	}
};