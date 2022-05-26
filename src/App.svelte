<script>
  import Router from "svelte-spa-router";
  import { PlacemarkService } from "./services/PlacemarkService";
  import { setContext } from "svelte";
  import Main from "./pages/Main.svelte";
  import Login from "./pages/Login.svelte";
  import Signup from "./pages/Signup.svelte";
  import Logout from "./pages/Logout.svelte";

  import { userStore } from "./stores/user-store.js";
  import Map from "./pages/Map.svelte";
  console.log($userStore);

  setContext("PlacemarkService", new PlacemarkService("http://localhost:3001"));

  const routes = {
    "/": Main,
    "/login": Login,
    "/signup": Signup,
    "/main": Main,
    "/logout": Logout,
    "/map": Map,
  };
</script>

<div class="container">
  <div class="tabs notification is-primary">
    <ul>
      <li><a href="/#/">Home</a></li>
      <li><a href="/#/map">Map</a></li>
      <li><a href="/#/login">Login</a></li>
      <li><a href="/#/signup">Signup</a></li>
      <li><a href="/#/logout">Logout</a></li>
    </ul>
    {#if $userStore.username}
      <div class="is-size-7">{$userStore.username}</div>
    {:else}
      <div class="is-size-7">Donation-Svelte 0.2</div>
    {/if}
  </div>
  <Router {routes} />
</div>

<style>
</style>
