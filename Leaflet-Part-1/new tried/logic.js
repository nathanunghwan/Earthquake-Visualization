// // Store our API endpoint as queryUrl.
// var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// // Perform a GET request to the query URL.
// d3.json(queryUrl).then(function (data) {
//   // Once we get a response, send the data.features object to the createFeatures function.
//   createFeatures(data.features);
// });

// function createFeatures(earthquakeData) {
//   // Define a function that we want to run once for each feature in the features array.
//   // Give each feature a popup that describes the place and time of the earthquake.
//   function onEachFeature(feature, layer) {
//     layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
//   }

//   // Define a function to create the circle radius based on the magnitude.
//   function radiusSize(magnitude) {
//     return magnitude * 3;
//   }

//   // Define a function to set the circle color based on the magnitude.
//   function circleColor(magnitude) {
//     if (magnitude <=1) {
//       return "##d3f705"
//     }
//     else if (magnitude < 2) {
//       return "#9fba02"
//     }
//     else if (magnitude < 3) {
//       return "#788c01"
//     }
//     else if (magnitude < 4) {
//       return "#556301"
//     }
//     else if (magnitude < 5) {
//       return "#2e3601"
//     }
//     else {
//       return "#070800"
//     }
//   }

//   // Create a GeoJSON layer that contains the features array on the earthquakeData object.
//   // Run the onEachFeature function once for each piece of data in the array.
//   var earthquakes = L.geoJSON(earthquakeData, {
//     pointToLayer: function (feature, latlng) {
//       return L.circleMarker(latlng, {
//         radius: radiusSize(feature.properties.mag),
//         fillColor: circleColor(feature.properties.mag),
//         fillOpacity: 1,
//         color: "black",
//         stroke: true,
//         weight: 0.5
//       });
//     },
//     onEachFeature: onEachFeature
//   });

//   // Send our earthquakes layer to the createMap function.
//   createMap(earthquakes);
// }

// function createMap(earthquakes) {
//   // Create the base layer.
//   var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
//   });

//   // Create a baseMaps object.
//   var baseMaps = {
//     "Street Map": street
//   };

//   // // Create an overlay object to hold our overlay.
//   // var overlayMaps = {
//   //   Earthquakes: earthquakes
//   // };

//   // Create our map, giving it the streetmap and earthquakes layers to display on load.
//   var myMap = L.map("map", {
//     center: [
//       37.09, -95.71
//     ],
//     zoom: 5,
//     layers: [street, earthquakes]
//   }).addTo(myMap);

//   // Create a legend.
//   var legend = L.control({ position: "bottomright" });

//   legend.onAdd = function () {
//     var div = L.DomUtil.create("div", "info legend");
//     var magnitudes = [0, 1, 2, 3, 4, 5];
//     var colors = ["##d3f705", "#9fba02", "#788c01", "#556301", "#2e3601", "#070800"];

//     for (var i = 0; i < magnitudes.length; i++) {
//       div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
//       + magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
//     }
//     return div;
//   };

//   // put legend to the map.
//   legend.addTo(map);
// }
// Creating the map object
var myMap = L.map("map", {
  center: [
    40.7, -94.5
  ],
  zoom: 3
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Getting our GeoJSON data
d3.json(queryUrl).then(function (data) {
  //Your data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color.
  //Take coordinates and magnitude from json
  //Two separate functions to calculate the color and radius.
  function mapStyle(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: mapColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: mapRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  //set color
  function mapColor(depth) {
    if (depth <= 10) {
      return "#ADFF2F";
    }
    else if (depth <= 20) {
      return "#7FFF00";
    }
    else if (depth <= 30) {
      return "#32CD32";
    }
    else if (depth <=50) {
      return "#00FF00";
    }
    else if (depth <=100) {
      return "#008000";
    }
    else {
      return "#006400";
    }

  }
  //set size
  function mapRadius(magnitude) {
    return magnitude * 4;
  }
  //set to add map, circlemarker, and binding popup
  L.geoJson(data, {
    
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    
    style: mapStyle,
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        "Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]
      );
    }
  }).addTo(myMap);

  //Set legend
  var legend = L.control({ 
    position: 'bottomright' 
  });

  // create div tage with info legend class
  legend.onAdd = function() {

    var div = L.DomUtil.create('div', 'info legend'),
        depth = [0,10, 20, 30, 50, 100];


    for (var i = 0; i < depth.length; i++) {
      div.innerHTML +=
        '<i style="background:' + mapColor(depth[i] + 1) + '"></i> ' +
        depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }

    return div;
  };

  // put legend to the map.
  legend.addTo(myMap);
});

