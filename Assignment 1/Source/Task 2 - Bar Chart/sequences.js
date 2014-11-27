var body = document.body,
    html = document.documentElement,
    margin = {top: 20, right: 150, bottom: 100, left: 50},
    width = body.clientWidth - margin.left - margin.right,
    height = Math.max(
        body.scrollHeight, html.scrollHeight,
        body.offsetHeight, html.offsetHeight,
        body.clientHeight, html.clientHeight) - margin.top - margin.bottom;

var header_translation =  {
  "P_00_14_JR": "Age 0 - 14",
  "P_15_24_JR": "Age 15 - 24",
  "P_25_44_JR": "Age 25 - 44",
  "P_45_64_JR": "Age 45 - 64",
  "P_65_EO_JR": "Age 65+"
};
     
var x = d3.scale.ordinal()
    .rangeBands([0, width]);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var scale = d3.scale.ordinal();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".0%"));

var svg = d3.select("body").append("svg")
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
 
function mouseOverArc(d) {
  tooltip.html(format_description(d));
  tooltip.transition()
    .duration(50)
    .style("width", "120px")
    .style("opacity", 0.9);
  tooltip.style("display", "block");
}

function mouseOutArc(){
  tooltip.style("display", "none");
}

function mouseMoveArc (d) {
  tooltip
    .style("top", (d3.event.pageY-10)+"px")
    .style("left", (d3.event.pageX+10)+"px");
}

function format_description(d) {
  var description = d.description;
      return  '<b>' + d.GM_NAAM + '</b></br></br>'+
              "<table CELLSPACING=3>" +
              "<tr><td align='left'><b>" +  header_translation["P_00_14_JR"] + ":</b></td><td>" + d.P_00_14_JR + "%</td></tr>" + 
              "<tr><td align='left'><b>" +  header_translation["P_15_24_JR"] + ":</b></td><td>" + d.P_15_24_JR + "%</td></tr>" + 
              "<tr><td align='left'><b>" +  header_translation["P_25_44_JR"] + ":</b></td><td>" + d.P_25_44_JR + "%</td></tr>" + 
              "<tr><td align='left'><b>" +  header_translation["P_45_64_JR"] + ":</b></td><td>" + d.P_45_64_JR + "%</td></tr>" + 
              "<tr><td align='left'><b>" +  header_translation["P_65_EO_JR"] + ":</b></td><td>" + d.P_65_EO_JR + "%</td></tr>" + 
              "</table>";
}

d3.tsv("../data/cities-data.txt", function(error, data) {
  data.clean();
  
	var categories = d3.keys(data[0]).filter(function(key) { return (key == "P_00_14_JR" || key == "P_15_24_JR" || key == "P_25_44_JR" || key == "P_45_64_JR" || key == "P_65_EO_JR"); })

  var parsedata = categories.map(function(name) { return { "Absolutes": name }; });
	data.forEach(function(d) {
		parsedata.forEach(function(pd) {
			pd[d["Absolutes"]] = d[pd["Absolutes"]];
		});
	});
  
  scale.domain(categories);
  
  data.forEach(function(d) {
    var y0 = 0;
    //var y0n = 0;
    d.ages = scale.domain().map(function(name) { 
			var responseobj = {name: name, y0: y0, y0n: y0 * parseInt(d.AANT_INW) / 100};
			y0 += +d[name];
			responseobj.y1 = y0;
			responseobj.y1n = y0 * parseInt(d.AANT_INW) / 100;
			return responseobj;
    });
    d.ages.forEach(function(d) { 
      d.y0 /= y0;
      d.y1 /= y0;
    });
  });

  data.sort(function(a, b) {
    return b.ages[b.ages.length - 2].y1 - a.ages[b.ages.length - 2].y1; 
  });

  x.domain(data.map(function(d) { return d.GM_NAAM; }));
  
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")");
      //.call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  var name = svg.selectAll(".name")
      .data(data)
    .enter().append("g")
      .attr("class", "name")
      .attr("transform", function(d) { return "translate(" + x(d.GM_NAAM) + ",0)"; })
      .on("mouseover", mouseOverArc)
      .on("mousemove", mouseMoveArc)
      .on("mouseout", mouseOutArc);

  name.selectAll("rect")
      .data(function(d) { return d.ages; })
    .enter().append("rect")
      .attr("width", x.rangeBand() * 1.3)
      .attr("y", function(d) { return y(d.y1); })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .attr("class", function(d) { return d.name; });

  var legend = svg.selectAll(".legend")
		.data(scale.domain())
		.enter().append("g")
		.attr("class", "legend")
		.attr("position", "fixed")
		.attr("transform", function(d, i) { return "translate(20," + ((height - 18) - (i * 20)) + ")"; });

	legend.append("rect")
		.attr("x", width - 18)
		.attr("width", 18)
		.attr("height", 18)
		.attr("class", function(d) { return d; });

	legend.append("text")
		.attr("x", width + 10)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "start")
    .text(function(d) { return header_translation[d]; });

  d3.selectAll("input").on("change", handleFormClick);

  function handleFormClick() {
    if (this.value === "bypercent") {
      transitionPercent();
    } else {
      transitionCount();
    }
  }
  
  // transition to 'percent' presentation
  function transitionPercent() {
    // reset the y domain to default
    y.domain([0, 1]);

    // create the transition
    var trans = svg.transition().duration(400);
    
    // transition the bars
    var categories = trans.selectAll(".name");
    categories.selectAll("rect")
      .attr("y", function(d) { return y(d.y1); })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); });
      
    // change the y-axis
    // set the y axis tick format
    yAxis.tickFormat(d3.format(".0%"));
    svg.selectAll(".y.axis").call(yAxis);
  }

  // transition to 'count' presentation
  function transitionCount() {
    // set the y domain
    y.domain([0, d3.max(data, function(d) {
        return parseInt(d.AANT_INW);
    })]);
    
    // create the transition
    var transone = svg.transition()
      .duration(400);
      
    // transition the bars (step one)
    var categoriesone = transone.selectAll(".name");
    categoriesone.selectAll("rect")
      .attr("y", function(d) { 
        return this.getBBox().y + this.getBBox().height - (y(d.y0n) - y(d.y1n));
      })
      .attr("height", function(d) { 
        return y(d.y0n) - y(d.y1n); 
      });
      
    // transition the bars (step two)
    var transtwo = transone.transition()
      .delay(400)
      .duration(400)
      .ease("bounce");
    var categoriestwo = transtwo.selectAll(".name");
    categoriestwo.selectAll("rect")
      .attr("y", function(d) { return y(d.y1n); });
    
    yAxis.tickFormat(d3.format(".2s"));
    svg.selectAll(".y.axis").call(yAxis);
  }
});

Array.prototype.clean = function() {
  for (var i = 0; i < this.length; i++) {
    if (this[i].Naam == "" || this[i].Naam == undefined) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
