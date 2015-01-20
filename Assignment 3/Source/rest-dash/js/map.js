//http://leafletjs.com/examples/quick-start.html
//http://bl.ocks.org/Caged/6476579

var map = L.map('map');
var data = [];
var defaultIcon;
var selectedIcon;
var clickedMarker;
var markers = [];
var restaurantRatings = [];
	
L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
	maxZoom: 18,
	id: 'examples.map-i875mjb7'
}).addTo(map);

//var popup = L.popup();
function onMapClick(e) {	
	if(clickedMarker)
	{
		clickedMarker.setIcon(defaultIcon);
	}	
	
	if(e.target.options.data)
	{
		e.target.setIcon(selectedIcon);
		clickedMarker = e.target;
		
		var entry = e.target.options.data;
		selectedMapMarker(entry);
		
		showInfo(entry);
	}
	else
	{
		nothingSelected();
	}
}

queue()
   .defer(d3.csv, "data/geoplaces2.csv")
   .defer(d3.csv, "data/rating_final.csv")
   .await(dataLoaded);

function dataLoaded(error, geoData, userRatings) {	
	data = geoData;
	map.on('click', onMapClick);
	
	initRestaurantRatings(data);
	fillRestaurantRatings(userRatings);
	createBarChart();
	nothingSelected();
	
	var restaurantSelection = document.getElementById("restaurantSelection");		
	var bounds = [];
	var BlueIcon = L.Icon.Default.extend({
		options: {
				iconUrl: 'img/marker-icon-blue.png' 
		}
	 });
	var RedIcon = L.Icon.Default.extend({
		options: {
				iconUrl: 'img/marker-icon-red.png' 
		}
	 });
	 selectedIcon = new RedIcon();
	 defaultIcon = new BlueIcon();
	 
	data.forEach(function(entry) {
		var lat = entry.latitude;
		var lon = entry.longitude;
		var name = entry.name;
		var placeID = entry.placeID;
		var coordinate = L.latLng(lat, lon);
		
		var marker = L.marker(coordinate, {
            data: entry,
			icon: defaultIcon
        });
		//marker.addTo(map).bindPopup("<b>Hello world!</b><br />I am " + name + " .").on('click', onMapClick);	
		marker.addTo(map).on('click', onMapClick);			
			
		bounds[bounds.length] = coordinate;
		markers[markers.length] = marker;
		
		var option = document.createElement("option");
		option.value = placeID;
		option.data = entry;
		option.text = name;
		restaurantSelection.add(option);
	});	
	map.fitBounds(bounds);
}

function selectRestaurant(placeID) {
	if(clickedMarker)
	{
		clickedMarker.setIcon(defaultIcon);
		//clickedMarker.closePopup();
	}
	markers.forEach(function(marker) {
		if(placeID == marker.options.data.placeID)
		{
			marker.setIcon(selectedIcon);
			map.panTo(marker._latlng);
			
			//marker.openPopup();
			clickedMarker = marker;
	
			showInfo(marker.options.data);
		}
	});
}

function selectedMapMarker(restaurant)
{    
    var element = document.getElementById('restaurantSelection');
    element.value = restaurant.placeID;

	showInfo(restaurant);
}

function initRestaurantRatings(restaurants)
{
	data.forEach(function(entry) {
		restaurantRatings[entry.placeID] =  {count:0, overall:0, service:0, food:0, overallData:[], serviceData:[], foodData:[] };
	});
}

function fillRestaurantRatings(userRatings)
{
	userRatings.forEach(function(userRating) {
		restaurantRatings[userRating.placeID].count++;
		restaurantRatings[userRating.placeID].overall += parseInt(userRating.rating);
		restaurantRatings[userRating.placeID].service += parseInt(userRating.service_rating);
		restaurantRatings[userRating.placeID].food += parseInt(userRating.food_rating);
		
		restaurantRatings[userRating.placeID].overallData[restaurantRatings[userRating.placeID].overallData.length] = parseInt(userRating.rating);
		restaurantRatings[userRating.placeID].serviceData[restaurantRatings[userRating.placeID].serviceData.length] = parseInt(userRating.service_rating);
		restaurantRatings[userRating.placeID].foodData[restaurantRatings[userRating.placeID].foodData.length] = parseInt(userRating.food_rating);
	});
}

function nothingSelected()
{
	hideInfo();
}

var margin = {top: 45, right: 20, bottom: 30, left: 40},
	width = 800 - margin.left - margin.right,
	height = 450 - margin.top - margin.bottom;
	
var x = d3.scale.ordinal()
	.rangeRoundBands([0, width], .1)
	.domain(["Overall", "Food", "Service"]);

var y = d3.scale.linear()
	.range([height, 0])
	.domain([0, 2]);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom");

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

var svg = d3.select("#ratingChart")
  .append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
  .append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
	var tooltip = "<strong>STD: </strong><span style='color:cyan'>" + d3.format(".2r")(d[2]) + "</span>";
    return tooltip;
});

svg.call(tip);
  
function showInfo(restaurant)
{	
	updateElementText("restaurantHeader", restaurant.name);
	updateElementText("address", restaurant.address);
	updateElementText("city", restaurant.city);
	updateElementText("state", restaurant.state);
	updateElementText("country", restaurant.country);
	updateElementText("zip", restaurant.zip);
	updateElementText("alcohol", restaurant.alcohol);
	updateElementText("smoking_area", restaurant.smoking_area);
	updateElementText("dress_code", restaurant.dress_code);
	updateElementText("accessibility", restaurant.accessibility);
	updateElementText("price", restaurant.price);
	updateElementText("url", restaurant.url != "?" ? "<a href='http://" + restaurant.url  +"' target='_blank' >" + restaurant.url + "</a>" : "?");
	
	showRating(restaurant.placeID);
}

function hideInfo(){
	updateElementText("restaurantHeader", "-");
	updateElementText("address", "-");
	updateElementText("city", "-");
	updateElementText("state", "-");
	updateElementText("country", "-");
	updateElementText("zip", "-");
	updateElementText("alcohol", "-");
	updateElementText("smoking_area", "-");
	updateElementText("dress_code", "-");
	updateElementText("accessibility", "-");
	updateElementText("price", "-");
	updateElementText("url", "-");
	
	hideRating();
}

function updateElementText(elementName, value){
	document.getElementById(elementName).innerHTML = (value != "?" ? value : "-");
}

function showRating(placeID)
{
	var rating = restaurantRatings[placeID];
	var barArray = [];
	barArray[0] = ["Overall", rating.overall / rating.count, standardDeviation(rating.overallData)];
	barArray[1] = ["Food", rating.food / rating.count, standardDeviation(rating.foodData)];
	barArray[2] = ["Service", rating.service / rating.count, standardDeviation(rating.serviceData)];
	barArray[3] = ["Count", rating.count];
	updateBarChart(barArray);
}

function hideRating()
{
	var barArray = [];
	barArray[0] = ["Overall", 0, 0, 0];
	barArray[1] = ["Food", 0, 0, 0];
	barArray[2] = ["Service", 0, 0, 0];
	barArray[3] = ["Count", 0];
	updateBarChart(barArray);
}

function createBarChart()
{
	var barArray = [];
	barArray[0] = ["Overall", 0];
	barArray[1] = ["Food", 0];
	barArray[2] = ["Service", 0];
	
	svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis);

	svg.append("g")
	  .attr("class", "y axis")
	  .call(yAxis)
	.append("text")
	  .attr("transform", "rotate(-90)")
	  .attr("y", 6)
	  .attr("dy", ".71em")
	  .style("text-anchor", "end")
	  .text("Rating");	  
	  
	svg.append("text")
	  .attr("class", "count")
      .text("Ratings: 0")
	  .attr("x", width - 125)
	  .attr("y", -5)
	  .attr("font-size", 18);
	
	var bars = svg.selectAll(".bar")
	  .data(barArray)
	  .enter();
		  
	bars.append("text")
	  .attr("class", "rating")
	  .attr("x", function(d) { return x(d[0]); })
	  .attr("width", x.rangeBand())
	  .attr("y", function(d) { return y(d[1]); })
	  .attr("height", function(d) { return height - y(d[1]); })
	  .attr("font-size", 25);
	  
	bars.append("rect")
	  .attr("class", "bar")
	  .attr("x", function(d) { return x(d[0]); })
	  .attr("width", x.rangeBand())
	  .attr("y", function(d) { return y(d[1]); })
	  .attr("height", function(d) { return height - y(d[1]); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
}

function updateBarChart(ratingArray)
{
	svg.selectAll(".bar")
	  .data(ratingArray)
	  .transition()
	  .attr("x", function(d) { return x(d[0]); })
	  .attr("width", x.rangeBand())
	  .attr("y", function(d) { return y(d[1]); })
	  .attr("height", function(d) { return height - y(d[1]); });
	  
	svg.selectAll(".rating")
	  .data(ratingArray)
	  .transition()
      .text(function(d) { return d3.format(".2r")(d[1]); })
	  .attr("x", function(d) { return x(d[0]) + 5; })
	  .attr("width", x.rangeBand())
	  .attr("y", function(d) { return y(d[1]) - 5; })
	  .attr("height", function(d) { return height - y(d[1]); })
	  .attr("font-size", 25);
	  
	svg.selectAll(".count")
      .text("Ratings: " + ratingArray[3][1]);
}

function standardDeviation(values){
  var avg = average(values);
  
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  
  var avgSquareDiff = average(squareDiffs);
 
  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}
 
function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);
 
  var avg = sum / data.length;
  return avg;
}
