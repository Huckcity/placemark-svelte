<script>
  import Router, { push } from "svelte-spa-router";
  import { wrap } from "svelte-spa-router/wrap";
  import { PlacemarkService } from "./services/PlacemarkService";
  import { setContext, getContext } from "svelte";
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

  // setContext("PlacemarkService", new PlacemarkService("http://localhost:3001"));
  setContext(
    "PlacemarkService",
    new PlacemarkService("https://placemark.herokuapp.com")
  );

  const placemarkService = getContext("PlacemarkService");

  const routes = {
    "/": Main,
    "/login": Login,
    "/signup": Signup,
    "/public": Public,
    "/main": Main,
    "/logout": Logout,

    "/login/github": wrap({
      conditions: [
        (detail) => {
          const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
          const clientSecret = import.meta.env.VITE_GITHUB_CLIENT_SECRET;

          const queryParams = new URLSearchParams(detail.querystring);
          const code = queryParams.get("code");

          const url = `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`;

          fetch(url)
            .then((response) => response.json())
            .then((json) => {
              const accessToken = json.access_token;
              const url = `https://api.github.com/user?access_token=${accessToken}`;

              fetch(url)
                .then((response) => response.json())
                .then((json) => {
                  const email = json.email;
                  const name = json.name;
                  console.log(json);
                  placemarkService.login(email, name);
                  push("/map");
                });
            });
          return true;
        },
      ],
    }),

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
