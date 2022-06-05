<script>
  import { userStore } from "../stores/user-store";
  import { getContext } from "svelte";

  import { fade } from "svelte/transition";
  export let place;

  const placemarkService = getContext("PlacemarkService");

  let images;
  let index = 0;

  images = place.placeImages;

  const next = () => {
    index = (index + 1) % images.length;
  };

  const deleteImage = (image) => {
    console.log(image);
    const imageName = image.split("/").pop();
    const res = placemarkService.deleteImage(place._id, imageName);
    res.then((data) => {
      console.log(data);
      if (data.status === 200) {
        place.placeImages = images.filter((img) => img !== image);
        images = place.placeImages;
        place = place;
        alert("Image deleted");
      } else {
        alert("Error deleting image");
      }
    });
  };
</script>

<div class="tile is-parent">
  <article class="tile is-child" style="text-align:center">
    <p class="title" style="font-weight: 600">{images.length} User Images</p>
  </article>
</div>
<div class="box">
  {#each [images[index]] as src (index)}
    <div class="image-gallery">
      <img {src} alt="" transition:fade />
      {#if $userStore.id}
        <div class="delete-image">
          <button class="button is-danger" on:click={() => deleteImage(src)}>
            <span class="icon">
              <i class="fas fa-trash" />
            </span>
          </button>
        </div>
      {/if}
    </div>
  {/each}
  <div class="load-more-images has-text-centered">
    <button class="button is-primary" on:click={next}>Next</button>
  </div>
</div>

<style>
  .image-gallery {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
    min-height: 600px;
    width: 100%;
  }

  .image-gallery img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-gallery button {
    position: absolute;
    top: 10px;
    right: 10px;
    margin-top: 1rem;
  }

  .delete-image {
    position: absolute;
    top: 5px;
    right: 10px;
    opacity: 50%;
  }

  .delete-image:hover {
    opacity: 100%;
  }

  .load-more-images {
    position: absolute;
    bottom: 10px;
    right: calc(50% - 50px);
    margin-top: 1rem;
  }
</style>
