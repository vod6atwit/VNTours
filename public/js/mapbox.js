/* eslint-disable */

// console.log(locations.forEach((loc) => console.log(loc.coordinates)));

export const displayMap = (locations) => {
  let coordinates = [];
  locations.forEach((loc, i) => {
    coordinates[i] = loc.coordinates;
  });

  mapboxgl.accessToken =
    'pk.eyJ1Ijoidm9kNiIsImEiOiJjbDZ2MHlsNHEyM2g0M2pvZDY0eHQzdjQyIn0.PFyCLxOCNAA0xI52hgQmxA';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/vod6/cl6v1iabk000914ro1b6gos1v',
    scrollZoom: false,
    // center: [-71.014504, 42.252278],
    // zoom: 10,
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });

  // add line connecting coordinates
  map.on('load', () => {
    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coordinates,
        },
      },
    });
    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#ff0000',
        'line-width': 1,
      },
    });
  });
};
