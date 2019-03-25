// API endpoint 
var eqUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the earth quake URL
d3.json(eqUrl, function (eqdata) {
  render_map(eqdata, null);
});