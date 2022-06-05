<script>
  import { userStore } from "../stores/user-store.js";
</script>

<div class="container is-flex is-justify-content-space-around">
  <div class="logo" />
  <div class="tabs is-align-items-center is-large is-right">
    {#if $userStore.username}
      <ul>
        <li><a href="/#/">Home</a></li>
        <li><a href="/#/map">Map</a></li>
        <li><a href="/#/logout">Logout</a></li>
      </ul>
    {:else}
      <ul>
        <li><a href="/#/">Home</a></li>
        <li><a href="/#/public">Public Places</a></li>
        <li><a href="/#/login">Login</a></li>
        <li><a href="/#/signup">Signup</a></li>
      </ul>
    {/if}
  </div>
</div>

<style>
  .logo {
    width: 140px;
    height: 100px;
    background-image: url("./logo.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>
