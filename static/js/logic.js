function render_map(eqdata, tpdata) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  // dark map tiles
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // satellite map tiles
  var satmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  // outdoor map tiles
  var outdoormap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  // grayscale map tiles
  var gsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satellite": satmap,
    "Outdoors": outdoormap,
    "Grayscale": gsmap
  };

  eqLayer = L.geoJSON(eqdata, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 3,
        fillColor: getColor(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function (feature, layer) {
      var date = new Date(feature.properties.time);
      date = date.toString().replace('(Central Daylight Time)', '');
      html = "<table>"
      html += "<tbody>"
      html += "<tr>"
      html += `<td colspan=2><strong>${date}</strong></td>`
      html += "</tr>"
      html += "<tr>"
      html += `<td colspan=2><hr></td>`
      html += "</tr>"
      html += "<tr>"
      html += `<td><strong>Place: </strong></td>`
      html += `<td>${feature.properties.place}</td>`
      html += "</tr>"
      html += "<tr>"
      html += `<td><strong>Magnitude: </strong></td>`
      html += `<td style='background:${getColor(feature.properties.mag)};'><em>${feature.properties.mag}</em></td>`
      html += "</tr>"
      html += "</tbody>"
      html += "<table>"
      layer.bindPopup(html);
    }
  })

  var defaultlayers = [streetmap, eqLayer]

  var overlayMaps = {
    "Earth Quakes": eqLayer
  }

  if (tpdata != null) {
    tpLayer = L.geoJSON(tpdata, {
      style: {
        color: "orange",
        weight: 4,
        opacity: 0.6
      }
    });
    overlayMaps['Tectonic Plates'] = tpLayer;
    defaultlayers.unshift(tpLayer);
  }

  // Create a new map
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: defaultlayers
  });

  // Create a layer control containing our baseMaps
  L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(myMap);

  addLegend(myMap);
}

function getColor(m) {
  return m >= 5 ? '#F06B6B' :
    m >= 4 ? '#F0A76B' :
      m >= 3 ? '#F4BA4D' :
        m >= 2 ? '#F3DC4C' :
          m >= 1 ? '#E1F34D' :
            '#B7F34D';
}

function addLegend(map) {
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
      magnitudes = [0, 1, 2, 3, 4, 5];

    innerHtml = "<div class='mag-legend'>";
    innerHtml += "<div class='legend-title'>Magnitude</div>";
    innerHtml += "<div class='legend-scale'>";
    innerHtml += "<ul class='legend-labels'>";

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitudes.length; i++) {
      innerHtml += `<li><span style='background:${getColor(magnitudes[i])};'></span>`
      innerHtml += magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
      innerHtml += '</li>';
    }

    innerHtml += "</ul>";
    innerHtml += "</div>";
    innerHtml += "</div>";

    div.innerHTML += innerHtml;
    return div;
  };

  legend.addTo(map);
}