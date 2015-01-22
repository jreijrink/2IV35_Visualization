//http://leafletjs.com/examples/quick-start.html
//http://bl.ocks.org/Caged/6476579

var map = L.map('map', { fullscreenControl: true });
var defaultIcon;
var selectedIcon;
var userIcon;
var userSelectedIcon;
var clickedMarker;
var clickedUserMarker;
var restaurantMarkers = [];
var userMarkers = [];
var restaurantRatings = [];
var consumerRatings = [];
var ratingLinesRes = [];
var ratingLinesUser = [];
var selectedLines = [];

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
  
L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
	maxZoom: 18,
	id: 'examples.map-i875mjb7'
}).addTo(map);

queue()
   .defer(d3.csv, "data/geoplaces2.csv")
   .defer(d3.csv, "data/userprofile.csv")
   .defer(d3.csv, "data/rating_final.csv")
   .await(dataLoaded);
      
function dataLoaded(error, geoData, users, userRatings)
{	
	map.on('click', onMapClick);
		
	_.each(geoData, function(value) {
		value.resLat = value.latitude
		value.resLon = value.longitude	
	});
	_.each(users, function(value) {
		value.conLat = value.latitude
		value.conLon = value.longitude	
	});

	var mergedUserRating = _.map(userRatings, function(item) {
		return _.extend(item, _.findWhere(users, { userID: item.userID }));
	});
	
	var mergedData = _.map(mergedUserRating, function(item) {
		return _.extend(item, _.findWhere(geoData, { placeID: item.placeID }));
	});
		
	initRatings(geoData, users);
	fillRatings(userRatings);
	createBarChart();
	nothingSelected();
	
	var restaurantSelection = document.getElementById("restaurantSelection");		
	var bounds = [];
	var DefaultIcon = L.Icon.Default.extend({
		options: {
				iconUrl: 'img/marker-icon-blue.png' 
		}
	 });
	var SelectedIcon = L.Icon.Default.extend({
		options: {
				iconUrl: 'img/marker-icon-orange.png' 
		}
	 });
	var UserIcon = L.Icon.Default.extend({
		options: {
				iconUrl: 'img/marker-user-green.png' 
		}
	 });
	var UserSelectedIcon = L.Icon.Default.extend({
		options: {
				iconUrl: 'img/marker-user-orange.png' 
		}
	 });
	 selectedIcon = new SelectedIcon();
	 defaultIcon = new DefaultIcon();
	 userIcon = new UserIcon();
	 userSelectedIcon = new UserSelectedIcon();
	 
	geoData.forEach(function(entry) {
		var lat = entry.latitude;
		var lon = entry.longitude;
		var name = entry.name;
		var placeID = entry.placeID;
		var coordinate = L.latLng(lat, lon);
		
		var marker = L.marker(coordinate, {
            data: entry,
			icon: defaultIcon
        });
		marker.addTo(map).on('click', onMapRestaurantClick);
		bounds[bounds.length] = coordinate;
		restaurantMarkers[placeID] = marker;
		ratingLinesRes[placeID] = [];
		
		var option = document.createElement("option");
		option.value = placeID;
		option.data = entry;
		option.text = name;
		restaurantSelection.add(option);
	});	
		
	users.forEach(function(entry) {
		var lat = entry.latitude;
		var lon = entry.longitude;
		var userID = entry.userID;
		var coordinate = L.latLng(lat, lon);
		
		var marker = L.marker(coordinate, {
            data: entry,
			icon: userIcon
        });
		marker.addTo(map).on('click', onMapUserClick);
			
		bounds[bounds.length] = coordinate;
		userMarkers[userID] = marker;
		ratingLinesUser[userID] = [];
	});	
	
	userRatings.forEach(function(entry) {
		var userID = entry.userID;
		var placeID = entry.placeID;
		
		var userMarker = getUserMarker(userID);
		var restaurantMarker = getRestaurantMarker(placeID);
	
		if(userMarker && restaurantMarker)
		{
		   var line = [];
			line.push(userMarker.getLatLng());
			line.push(restaurantMarker.getLatLng());

			var polyline_options = {
				color: '#000',
				weight: 0
			};

			var polyline = L.polyline(line, polyline_options).addTo(map);
			
			ratingLinesRes[placeID][ratingLinesRes[placeID].length] = polyline;
			ratingLinesUser[userID][ratingLinesUser[userID].length] = polyline;
		}
	});	
	
	map.fitBounds(bounds);
}

function onMapClick(e)
{
		if(clickedMarker)
		{
			clickedMarker.setIcon(defaultIcon);
		}

		if(clickedUserMarker)
		{
			clickedUserMarker.setIcon(userIcon);
		}
		
		nothingSelected();
}

function onMapRestaurantClick(e)
{	
	if(clickedMarker)
	{
		clickedMarker.setIcon(defaultIcon);
	}
	
	if(clickedUserMarker)
	{
		clickedUserMarker.setIcon(userIcon);
	}
	
	e.target.setIcon(selectedIcon);
	clickedMarker = e.target;
	
	var entry = e.target.options.data;
	selectedMapMarker(entry);
	
	showRestaurantInfo(entry);
}

function onMapUserClick(e)
{	
	if(clickedMarker)
	{
		clickedMarker.setIcon(defaultIcon);
	}
	if(clickedUserMarker)
	{
		clickedUserMarker.setIcon(userIcon);
	}
	
	nothingSelected();
	
	
	e.target.setIcon(userSelectedIcon);
	clickedUserMarker = e.target;
	
	var entry = e.target.options.data;
	
	var lines = getUserRatingLines(entry.userID);
	updateLineColor(lines);
	
	showUserInfo(entry);
}

function selectRestaurant(placeID)
{
	if(clickedMarker)
	{
		clickedMarker.setIcon(defaultIcon);
	}
	
	var marker = getRestaurantMarker(placeID);
	if(marker)
	{
		marker.setIcon(selectedIcon);
		map.panTo(marker._latlng);		
		clickedMarker = marker;
		showRestaurantInfo(marker.options.data);
		
		var lines = getRestaurantRatingLines(placeID);
		updateLineColor(lines);
	}
}

function updateLineColor(newLines)
{
	selectedLines.forEach(function(line) {
		line.setStyle({
			color: '#000',
			weight: 0
			});
	});
	
	newLines.forEach(function(line) {
		line.setStyle({
			color: 'red',
			weight: 2
			});
	});
	
	selectedLines = newLines;
}

function getRestaurantMarker(placeID)
{
	return restaurantMarkers[placeID];
}

function getUserMarker(userID)
{
	return userMarkers[userID];
}

function getRestaurantRatingLines(placeID)
{
	return ratingLinesRes[placeID];
}

function getUserRatingLines(userID)
{
	return ratingLinesUser[userID];
}

function selectedMapMarker(restaurant)
{    
    var element = document.getElementById('restaurantSelection');
    element.value = restaurant.placeID;

	showRestaurantInfo(restaurant);
}

function initRatings(restaurants, users)
{
	restaurants.forEach(function(entry) {
		restaurantRatings[entry.placeID] =  {count:0, overall:0, service:0, food:0, overallData:[], serviceData:[], foodData:[] };
	});

	users.forEach(function(entry) {
		var userID = getUserID(entry.userID);
		consumerRatings[userID] =  {count:0, overall:0, service:0, food:0, overallData:[], serviceData:[], foodData:[] };
	});
}

function fillRatings(ratings)
{
	ratings.forEach(function(userRating) {
		restaurantRatings[userRating.placeID].count++;
		restaurantRatings[userRating.placeID].overall += parseInt(userRating.rating);
		restaurantRatings[userRating.placeID].service += parseInt(userRating.service_rating);
		restaurantRatings[userRating.placeID].food += parseInt(userRating.food_rating);
		
		restaurantRatings[userRating.placeID].overallData[restaurantRatings[userRating.placeID].overallData.length] = parseInt(userRating.rating);
		restaurantRatings[userRating.placeID].serviceData[restaurantRatings[userRating.placeID].serviceData.length] = parseInt(userRating.service_rating);
		restaurantRatings[userRating.placeID].foodData[restaurantRatings[userRating.placeID].foodData.length] = parseInt(userRating.food_rating);
		
		var userID = getUserID(userRating.userID);		
		consumerRatings[userID].count++;
		consumerRatings[userID].overall += parseInt(userRating.rating);
		consumerRatings[userID].service += parseInt(userRating.service_rating);
		consumerRatings[userID].food += parseInt(userRating.food_rating);
		
		consumerRatings[userID].overallData[consumerRatings[userID].overallData.length] = parseInt(userRating.rating);
		consumerRatings[userID].serviceData[consumerRatings[userID].serviceData.length] = parseInt(userRating.service_rating);
		consumerRatings[userID].foodData[consumerRatings[userID].foodData.length] = parseInt(userRating.food_rating);
	});
}

function nothingSelected()
{
	hideInfo();
}

function showRestaurantInfo(restaurant)
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
	
	document.getElementById("restaurant-information").style.visibility = "visible";
	document.getElementById("user-information").style.visibility = "hidden";
	
	var rating = restaurantRatings[restaurant.placeID];
	showRating(rating);
	
	var lines = getRestaurantRatingLines(restaurant.placeID);
	updateLineColor(lines);
}

function showUserInfo(user)
{
	updateElementText("smoker", user.smoker);
	updateElementText("drink_level", user.drink_level);
	updateElementText("dress_preference", user.dress_preference);
	updateElementText("ambience", user.ambience);
	updateElementText("transport", user.transport);
	updateElementText("marital_status", user.marital_status);
	updateElementText("birth_year", user.birth_year);
	updateElementText("interest", user.interest);
	updateElementText("personality", user.personality);
	updateElementText("religion", user.religion);
	updateElementText("activity", user.activity);
	updateElementText("color", user.color);
	updateElementText("weight", user.weight);
	updateElementText("budget", user.budget);
	updateElementText("height", user.height);
	
	
	document.getElementById("user-information").style.visibility = "visible";
	document.getElementById("restaurant-information").style.visibility = "hidden";
	
	var userID = getUserID(user.userID);
	var rating = consumerRatings[userID];
	showRating(rating);	
}

function hideInfo()
{	
	document.getElementById("user-information").style.visibility = "hidden";
	document.getElementById("restaurant-information").style.visibility = "hidden";
	
	hideRating();
	
	updateLineColor([]);
}

function updateElementText(elementName, value)
{
	document.getElementById(elementName).innerHTML = (value != "?" ? value : "-");
}

function showRating(rating)
{
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

function getUserID(userID)
{
	if(userID)
	{
		userID = userID.substr(1);
		return parseInt(userID);
	}
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

function standardDeviation(values)
{
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
 
function average(data)
{
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);
 
  var avg = sum / data.length;
  return avg;
}
