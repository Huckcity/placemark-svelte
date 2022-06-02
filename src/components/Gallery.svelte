<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  export let place;

  let images;
  let index = 0;

  images = place.placeImages;
  console.log(images);
  if (images.length > 1) {
    images.splice(0, 1);
  }

  const next = () => {
    index = (index + 1) % images.length;
  };
</script>

<div class="tile is-parent">
  <article class="tile is-child" style="text-align:center">
    <p class="title" style="font-weight: 600">Images</p>
  </article>
</div>
<div class="box image-gallery">
  {#each [images[index]] as src (index)}
    <img {src} alt="" transition:fade />
  {/each}
  <button on:click={next}>Next</button>
</div>

<style>
  .image-gallery {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
    min-height: 500px;
    width: 100%;
  }

  .image-gallery img {
    position: absolute;
  }

  .image-gallery button {
    position: absolute;
    top: 10px;
    right: 10px;
    margin-top: 1rem;
  }
</style>
