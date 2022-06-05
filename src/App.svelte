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
  import Navbar from "./components/Navbar.svelte";
  import AddImage from "./pages/AddImage.svelte";

  setContext("PlacemarkService", new PlacemarkService("http://localhost:3001"));

  const routes = {
    "/": Main,
    "/login": Login,
    "/signup": Signup,
    "/public": Public,
    "/main": Main,
    "/logout": Logout,

    "/map": wrap({
      component: Map,
      conditions: [
        () => {
          if ($userStore.id) {
            return true;
          } else {
            push("/logout");
            return false;
          }
        },
      ],
    }),

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

    "/places/:id/images/add": wrap({
      component: AddImage,
      conditions: [
        () => {
          if ($userStore.id) {
            return true;
          } else {
            push("/logout");
            return false;
          }
        },
      ],
    }),
  };
</script>

<div class="container">
  <Navbar />
  <Router {routes} />
</div>
