<script>
  import { onMount } from "svelte";
  export let place;

  let images,
    counter = 2;

  onMount(async () => {
    const cx = "d2c8925f654cd4c6d";
    const api = "AIzaSyDygASC0vpQNVMCpshiqTojHVGnVoAhrcA";

    const endpoint =
      "https://cors-anyhuck.herokuapp.com/https://www.googleapis.com/customsearch/v1?q=";
    const query = `${place.name}`;
    const url = `${endpoint}${query}&cx=${cx}&num=${counter}&searchType=image&key=${api}`;
    const response = await fetch(url);
    const data = await response.json();

    images = data.items.map((item) => {
      return {
        url: item.link,
        snippet: item.snippet,
        context: item.image.contextLink,
      };
    });
  });

  const loadMoreImages = async () => {
    const cx = "d2c8925f654cd4c6d";
    const api = "AIzaSyDygASC0vpQNVMCpshiqTojHVGnVoAhrcA";

    counter += 2;

    if (counter > 10) {
      counter = 10;
      alert("Cannot load more than 10 images");
    }

    const endpoint =
      "https://cors-anyhuck.herokuapp.com/https://www.googleapis.com/customsearch/v1?q=";
    const query = `${place.name}`;
    const url = `${endpoint}${query}&cx=${cx}&num=${counter}&searchType=image&key=${api}`;
    const response = await fetch(url);
    const data = await response.json();

    images = data.items.map((item) => {
      return {
        url: item.link,
        snippet: item.snippet,
        context: item.image.contextLink,
      };
    });
  };
</script>

<div class="box bottom">
  <div class="images-box">
    {#if images}
      {#each images as image}
        <div>
          <a href={image.url} target="_blank">
            <img class="image" src={image.url} alt={image.snippet} />
          </a>
        </div>
      {/each}
    {/if}
  </div>
  <div class="load-more-images has-text-centered">
    <button class="button is-primary" on:click={() => loadMoreImages()}>
      Load More Images
    </button>
  </div>
</div>

<style>
  .images-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .image {
    width: 400px;
    height: 200px;
    object-fit: cover;
    object-position: center;
    margin: 10px;
  }

  .image:hover {
    border: 1px solid #ccc;
  }

  button {
    margin-top: 10px;
    padding: 10px;
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1.2em;
  }

  button:hover {
    background-color: #e6e6e6;
  }

  button:active {
    background-color: #ccc;
  }

  .load-more-images {
    margin-top: 10px;
  }

  .box {
    margin-bottom: 50px;
  }
</style>
