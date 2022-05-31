<script>
  import { getContext, onMount } from "svelte";
  import { userStore } from "../stores/user-store";
  import PlacemarkMap from "../components/PlacemarkMap.svelte";
  import Menu from "../components/Menu.svelte";

  export let publicPlaces = true;

  const placemarkService = getContext("PlacemarkService");

  let places, filteredPlaces, categories, selectedCategory, map;

  onMount(async () => {
    getPlaces(publicPlaces);
    categories = await placemarkService.getCategories();
  });

  const getPlaces = async (publicPlaces) => {
    if (publicPlaces) {
      places = await placemarkService.getPublicPlaces();
    } else {
      places = await placemarkService.getUserPlaces($userStore.id);
    }
    filteredPlaces = places;
  };

  const updatePlaces = (selectedCategory) => {
    if (selectedCategory === "All") {
      filteredPlaces = places;
    } else {
      filteredPlaces = places.filter((place) => {
        return place.category.name === selectedCategory;
      });
    }
    map.moveTo(12, filteredPlaces[0]);
  };

  const moveToPlace = (place) => {
    map.moveTo(12, place);
  };
</script>

<div class="is-flex">
  <div class="pr-4">
    {#if categories}
      <Menu
        {categories}
        {selectedCategory}
        {filteredPlaces}
        {updatePlaces}
        {moveToPlace}
      />
    {/if}
  </div>
  <div class="is-flex-grow-1">
    {#if places}
      <PlacemarkMap {filteredPlaces} bind:this={map} />
    {/if}
  </div>
</div>
