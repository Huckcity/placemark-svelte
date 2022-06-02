<script>
  import { onMount, getContext } from "svelte";
  import { push, querystring } from "svelte-spa-router";
  import "leaflet/dist/leaflet.css";
  import { LeafletMap } from "../services/leaflet-map";
  import WeatherBox from "../components/WeatherBox.svelte";

  export let params = {};

  console.log(import.meta.env.VITE_WEATHERAPI_KEY);

  const placemarkService = getContext("PlacemarkService");
  let place, reviews;
  const queryParams = new URLSearchParams($querystring);
  const publicPlace = queryParams.get("public") === "true";

  onMount(async () => {
    if (publicPlace) {
      place = await placemarkService.getPublicPlaceById(params.id);
    } else {
      place = await placemarkService.getPlaceById(params.id);
      if (!place) {
        alert("You are not authorized to view this page");
        push("/");
      }
    }
    reviews = await placemarkService.getReviewsByPlaceId(params.id);
    console.log(reviews);
    console.log(place);

    const mapConfig = {
      location: { lat: place.location.lat, lng: place.location.lng },
      zoom: 12,
      minZoom: 1,
    };

    const mapConfig2 = { ...mapConfig, zoom: 15 };

    let map = new LeafletMap("map", mapConfig);
    let map2 = new LeafletMap("map2", mapConfig2, "Satellite");
    map.showZoomControl();
    map2.showZoomControl();

    map.addMarker({ lat: place.location.lat, lng: place.location.lng });
    map2.addMarker({ lat: place.location.lat, lng: place.location.lng });
  });

  const prettyDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    // @ts-ignore
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const averageRating = (reviews) => {
    let sum = 0;
    reviews.forEach((review) => {
      sum += review.rating;
    });
    return Math.round(sum / reviews.length);
  };
</script>

<div class="is-flex">
  <div class="box" id="map" style="height:300px; width: 50%" />
  <div class="box" id="map2" style="height:300px; width: 50%" />
</div>

{#if place && reviews}
  <div class="is-flex">
    <h3 class="title is-3">{place.name}</h3>
    <div class="average-rating">
      {#each { length: averageRating(reviews) } as _}
        <span class="icon is-large">
          <i class="fas fa-star" />
        </span>
      {/each}
    </div>
  </div>
  <div class="tile is-ancestor">
    <div class="tile is-4 is-vertical is-parent">
      <div class="tile is-child box">
        <p class="title is-5">Reviews</p>
        <div class="content">
          {#if reviews.length > 0}
            {#each reviews as review}
              <div>
                <p class="quote">"{review.comment}"</p>
                <p class="">
                  <small>
                    - {review.user.firstName}, {prettyDate(
                      review.createdAt
                    )}</small
                  >
                </p>
              </div>
            {/each}
          {:else}
            <p>No reviews yet</p>
          {/if}
        </div>
      </div>
    </div>
    <div class="tile is-parent">
      <div class="tile is-child box">
        <p class="title is-5">Description</p>
        <p>{place.description}</p>
      </div>
    </div>
  </div>

  <WeatherBox {place} />
{/if}

<style>
  .quote {
    font-style: italic;
  }

  .average-rating {
    margin-top: -0.3rem;
  }

  .icon {
    font-size: 1.5rem;
    margin-left: -5px;
    color: #ffb400;
  }
</style>
