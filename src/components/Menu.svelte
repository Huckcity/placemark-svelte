<script>
  let active = false;
  export let categories;
  export let selectedCategory;
  export let filteredPlaces;
  export let updatePlaces;
  export let moveToPlace;

  const setCategory = (val) => {
    selectedCategory = val;
    updatePlaces(selectedCategory);
  };
</script>

<div
  class={active ? "dropdown is-active" : "dropdown"}
  on:click={() => (active = !active)}
>
  <div class="dropdown-trigger">
    <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
      <span> Select a category </span>
      <span class="icon is-small">
        <i class="fas fa-angle-down" aria-hidden="true" />
      </span>
    </button>
  </div>
  <div
    class="dropdown-menu"
    id="dropdown-menu"
    role="menu"
    style="z-index: 99999;"
  >
    <div class="dropdown-content">
      <span class="dropdown-item" on:click={() => setCategory("All")}>All</span>
      {#each categories as category}
        <span class="dropdown-item" on:click={() => setCategory(category.name)}>
          {category.name}
        </span>
      {/each}
    </div>
  </div>
</div>

<div class="list-of-places">
  {#if filteredPlaces}
    {#each filteredPlaces as place}
      <div class="list-of-places-item">
        <a href={place.url} on:click={() => moveToPlace(place)}>
          <div class="list-of-places-item-content">
            <div class="list-of-places-item-content-title">
              {place.name}
            </div>
          </div>
        </a>
      </div>
    {/each}
  {/if}
</div>
