<script>
  import { LeafletMap } from "../services/leaflet-map";
  import { onMount } from "svelte";

  export let filteredPlaces;

  let map;

  const mapConfig = {
    location: { lat: 53.160858, lng: -8.15242 },
    zoom: 7,
    minZoom: 1,
  };

  onMount(async () => {
    map = new LeafletMap("map", mapConfig);
    map.showZoomControl();

    filteredPlaces.forEach((place) => {
      map.addMarker(
        place.location,
        "<a href=/#/place/" +
          place._id +
          "?public=" +
          place.public +
          ">" +
          place.name +
          "</a>",
        place.category.name
      );
    });

    map.showLayerControl();
    // zoom to random place
    const randomPlace =
      filteredPlaces[Math.floor(Math.random() * filteredPlaces.length)];
    map.moveTo(12, randomPlace.location);
  });

  export const moveTo = (zoom, place) => {
    map.moveTo(zoom, place.location);
  };
</script>

<div class="box" id="map" style="height:800px" />
