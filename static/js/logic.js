var queryUrl= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

d3.json(queryUrl, function(data){

  createFeatures(data.features)


});

function createFeatures(earthquakeData){
 function onEachFeature(feature,layer){
     //console.log(layer);
    
     
     layer.bindPopup("<h4>" +feature.properties.place +"</h4><hr><h4> Magnitude"+ feature.properties.mag +"</h4>" );
 //}
   
}
  var earthquakes=L.geoJSON(earthquakeData,{
      onEachFeature:onEachFeature
  });
createMap(earthquakes);
}


function createMap(earthquakes){

    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
      });

        // Define a baseMaps object to hold our base layers
    var baseMaps = {
    "Street Map": streetmap
    
     };
     // Create overlay object to hold our overlay layer
    var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}