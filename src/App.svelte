<script>
  import Router, { push } from "svelte-spa-router";
  import { wrap } from "svelte-spa-router/wrap";
  import { PlacemarkService } from "./services/PlacemarkService";
  import { setContext } from "svelte";
  import { userStore } from "./stores/user-store.js";

  import Main from "./pages/Main.svelte";
  import Login from "./pages/Login.svelte";
  import Signup from "./pages/Signup.svelte";
  import Logout from "./pages/Logout.svelte";
  import Map from "./pages/Map.svelte";
  import Public from "./pages/Public.svelte";
  import Place from "./pages/Place.svelte";

  setContext("PlacemarkService", new PlacemarkService("http://localhost:3001"));

  const routes = {
    "/": Main,
    "/login": Login,
    "/signup": Signup,
    "/public": Public,
    "/map": Map,
    "/main": Main,
    "/logout": Logout,

    "/place/:id": wrap({
      component: Place,
      conditions: [
        (detail) => {
          const queryParams = new URLSearchParams(detail.querystring);
          const publicPlace = queryParams.get("public") === "true";
          if (!publicPlace && !$userStore.id) {
            alert("You need to be logged in to view this page");
            push("/login");
            return false;
          }
          return true;
        },
      ],
    }),
  };
</script>

<div class="container">
  <div class="tabs notification is-primary">
    {#if $userStore.username}
      <ul>
        <li><a href="/#/">Home</a></li>
        <li><a href="/#/map">Map</a></li>
        <li><a href="/#/logout">Logout</a></li>
      </ul>
      <div class="is-size-7">{$userStore.username}</div>
    {:else}
      <ul>
        <li><a href="/#/">Home</a></li>
        <li><a href="/#/public">Public Places</a></li>
        <li><a href="/#/login">Login</a></li>
        <li><a href="/#/signup">Signup</a></li>
      </ul>
      <div class="is-size-7">Placemark</div>
    {/if}
  </div>
  <Router {routes} />
</div>

<style>
</style>
