import { LngLatLike, Map, NavigationControl, Popup } from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import dataset from "../dataset/dataset.geojson"

// Configure base map properties e.g. default position, zoom level, etc.
const map = new Map({
  container: "map",
  style:
    "https://api.maptiler.com/maps/topo/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
  center: [121.652, 12.954],
  zoom: 6,
})

map.on("load", () => {
  // Add a layer showing the places.
  map.addSource("points", {
    type: "geojson",
    data: dataset,
  })

  // Add a layer showing the points from the dataset.
  map.addLayer({
    id: "points",
    type: "circle",
    paint: {
      "circle-color": "red"
    },
    source: "points",
  })

  const popup = new Popup({
    closeButton: true,
    closeOnClick: true,
  })

  // When a click event occurs on a feature in the 'points' layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  map.on("click", "points", (e) => {
    const feature = e.features![0]
    if ("coordinates" in feature.geometry) {
      const coordinates: number[] =
        feature.geometry.coordinates.slice() as number[]

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
      }

      const name = feature.properties?.name ?? ""
      popup
        .setLngLat(coordinates as LngLatLike)
        .setHTML(name)
        .addTo(map)
    }
  })

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on("mouseenter", "points", function() {
    map.getCanvas().style.cursor = "pointer"
  })

  // Change it back to a pointer when it leaves.
  map.on("mouseleave", "points", function() {
    map.getCanvas().style.cursor = ""
  })

  // Add map navigation controls.
  map.addControl(new NavigationControl({}))
})
