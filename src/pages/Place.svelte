<script>
  import { onMount, getContext } from "svelte";
  import { push, querystring } from "svelte-spa-router";
  import { userStore } from "../stores/user-store";

  import "leaflet/dist/leaflet.css";
  import { LeafletMap } from "../services/leaflet-map";

  import WeatherBox from "../components/WeatherBox.svelte";
  import Gallery from "../components/Gallery.svelte";
  import GoogleImages from "../components/GoogleImages.svelte";

  import { prettyDate, averageRating } from "../services/utils";

  export let params = {};

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
        push("/logout");
      }
    }

    console.log(place.placeImages);

    place.placeImages.splice(0, 1);
    reviews = await placemarkService.getReviewsByPlaceId(params.id);

    const mapConfig = {
      location: { lat: place.location.lat, lng: place.location.lng },
      zoom: 12,
      minZoom: 1,
    };

    const mapConfig2 = { ...mapConfig, zoom: 16 };

    let map = new LeafletMap("map1", mapConfig);
    let map2 = new LeafletMap("map2", mapConfig2, "Satellite");
    map.showZoomControl();
    map2.showZoomControl();

    map.addMarker({ lat: place.location.lat, lng: place.location.lng });
    map2.addMarker({ lat: place.location.lat, lng: place.location.lng });
  });
</script>

<div class="is-flex">
  <div class="box" id="map1" style="height:300px; width: 50%" />
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

  {#if place.placeImages.length > 0}
    <Gallery bind:place />
  {:else}
    <div class="box is-flex is-justify-content-space-around">
      <p class="title is-5 has-text-centered">
        No user images yet. Displaying top results from Google Images.
      </p>
      {#if $userStore.id}
        <a href="/#/places/{place._id}/images/add">
          <button class="button is-primary">Add images</button>
        </a>
      {:else}
        <a href="/#/login">
          <button class="button is-primary">Login to add images</button>
        </a>
      {/if}
    </div>
    <GoogleImages {place} />
  {/if}
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
