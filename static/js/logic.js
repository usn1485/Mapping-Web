// API call to USGS API to get earthquake data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// GET request to the query URL
d3.json(queryUrl, function(data) {
  console.log(data),
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // each feature a popup describing with information
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3 > Magnitude: "+ feature.properties.mag + 
      "</h3><h3>Location: " + feature.properties.place +
      "</h3><hr><h3>" + new Date(feature.properties.time) + "</h3>" );
  }

  // GeoJSON layer containing the features
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer : pointToLayer
  });

 
  createMap(earthquakes);
}

function getColor(magnitude){
  debugger
  return magnitude >= 5 ?  "#ffff66"  :
  magnitude >= 4 ? "#80ff00":
      magnitude >= 3 ? "#ffb266" :
          magnitude >= 2 ?"#ff8000" :
              magnitude >= 1 ? "#ff0000":
                 "#b2ff66";

}

// Create Circles with a light gray circumferance line!
function pointToLayer(feature,latlng) {
  debugger
    return new L.circle(latlng, {
        stroke: true,
        color: "blue",
        weight: .4,
        fillOpacity: .6,
        fillColor: getColor(feature.properties.mag),
        radius:  feature.properties.mag * 35000
    })
}

function createMap(earthquakes) {

  // light and dark map visualization
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  //var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, \
    <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery A© <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 15,
    id: "mapbox.light",
    accessToken: API_KEY
  });
  
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, \
    <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery A© <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 15,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object
  var baseMaps = {
    "Light Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object 
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);

}
