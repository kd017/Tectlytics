// API endpoint 
var eqUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var tpUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

// Perform a GET request to the query URL
d3.json(eqUrl, function (eqdata) {
  console.log(eqdata)
  d3.json(tpUrl, function (tpdata) {
    render_map(eqdata, tpdata)
  });
});