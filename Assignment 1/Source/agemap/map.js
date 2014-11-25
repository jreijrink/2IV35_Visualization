var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(20, "");

var cityData = d3.map();

var cityDataAll = d3.map();

var linearColorScale = d3.scale.linear()
    .domain([0.0, 100.0])
    //.range(["white", "red"]);
    //.range(["white", "black"]);
    //.range(["lightgreen", "darkred"]);
    .range(["lightgreen", "red"]);
    //.range(["yellow", "purple"]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// Setup the map projection for a good depiction of The Netherlands. The
// projection is centered on the geographical center of the country, which
// happens to be the city of Lunteren.
var projection = d3.geo.albers()
      .rotate([0, 0])
      .center([5.6, 52.1])
      .parallels([50, 53])
      .scale(15000)
      .translate([width/2,height/2]);

var path = d3.geo.path().projection(projection);
 
var g = svg.append("g");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


function mouseOverArc(d) {
  var data = cityDataAll.get(d.gm_code);
  var ages = [];
  var agegroup = { age:5, percentage:data.P_00_04_JR };
  ages[0] = agegroup;
  agegroup = { age:10, percentage:data.P_05_09_JR };
  ages[1] = agegroup;
  agegroup = { age:15, percentage:data.P_10_14_JR };
  ages[2] = agegroup;
  agegroup = { age:20, percentage:data.P_15_19_JR };
  ages[3] = agegroup;
  agegroup = { age:25, percentage:data.P_20_24_JR };
  ages[4] = agegroup;
  agegroup = { age:30, percentage:data.P_25_29_JR };
  ages[5] = agegroup;
  agegroup = { age:35, percentage:data.P_30_34_JR };
  ages[6] = agegroup;
  agegroup = { age:40, percentage:data.P_35_39_JR };
  ages[7] = agegroup;
  agegroup = { age:45, percentage:data.P_40_44_JR };
  ages[8] = agegroup;
  agegroup = { age:50, percentage:data.P_45_49_JR };
  ages[9] = agegroup;
  agegroup = { age:55, percentage:data.P_50_54_JR };
  ages[10] = agegroup;
  agegroup = { age:60, percentage:data.P_55_59_JR };
  ages[11] = agegroup;
  agegroup = { age:65, percentage:data.P_60_65_JR };
  ages[12] = agegroup;
  agegroup = { age:70, percentage:data.P_65_69_JR };
  ages[13] = agegroup;
  agegroup = { age:75, percentage:data.P_70_74_JR };
  ages[14] = agegroup;
  agegroup = { age:80, percentage:data.P_75_79_JR };
  ages[15] = agegroup;
  agegroup = { age:85, percentage:data.P_80_84_JR };
  ages[16] = agegroup;
  agegroup = { age:90, percentage:data.P_85_89_JR };
  ages[17] = agegroup;
  agegroup = { age:95, percentage:data.P_90_94_JR };
  ages[18] = agegroup;
  agegroup = { age:100, percentage:data.P_95_EO_JR };
  ages[19] = agegroup;
        
  svg.selectAll(".bar").remove();
  svg.selectAll(".bar")
      .data(ages)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.age); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.percentage); })
      .attr("height", function(d) { return height - y(d.percentage); });
}
queue()
   .defer(d3.json, "cities-geometry.json")
   .defer(d3.tsv, "cities-data.txt", function(d) { if(d.Naam != "") { cityData.set(d.Code, +d.P_65_EO_JR); } })
   .defer(d3.tsv, "cities-data.txt", function(d) { cityDataAll.set(d.Code, d); })
   .await(dataLoaded);

function dataLoaded(error, mapData) {
    var maxValue = d3.max(cityData.values());
    var minValue = d3.min(cityData.values());
    console.log(minValue);
    linearColorScale.domain([minValue, maxValue]);
    
    g.selectAll("path")
    .data(mapData.features).enter()
    .append("path")
    .attr("d", path)
    .style("fill", function(d) { return linearColorScale(cityData.get(d.gm_code)); })    
    .on("mouseover", mouseOverArc)
    .append("title").text(function(d) {
      return d.gm_naam + ", " + cityData.get(d.gm_code) + "%"; 
    });
    
    x.domain([0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100]);
    y.domain([0.0, 18.0]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(16," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("y", 28)
        .attr("x", 685)
        .text("Age group");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Percentage");
}