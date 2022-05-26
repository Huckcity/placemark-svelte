<script>
  import "leaflet/dist/leaflet.css";
  import { LeafletMap } from "../services/leaflet-map";
  import { getContext, onMount } from "svelte";
  import { userStore } from "../stores/user-store";

  const placemarkService = getContext("PlacemarkService");

  const mapConfig = {
    location: { lat: 52.160858, lng: -7.15242 },
    zoom: 8,
    minZoom: 1,
  };

  onMount(async () => {
    const map = new LeafletMap("donation-map", mapConfig);
    map.showZoomControl();

    const places = await placemarkService.getUserPlaces($userStore.id);
    console.log(places);
    places.forEach((place) => {
      map.addMarker({ lat: place.location.lat, lng: place.location.lng });
    });
  });
</script>

<div class="box" id="donation-map" style="height:800px" />
