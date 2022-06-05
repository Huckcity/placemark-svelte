<script>
  import { push } from "svelte-spa-router";
  import { getContext } from "svelte";
  import { querystring } from "svelte-spa-router";

  console.log("oiljgfhsdl");

  const placemarkService = getContext("PlacemarkService");

  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_GITHUB_CLIENT_SECRET;

  const queryParams = new URLSearchParams($querystring);
  const code = queryParams.get("code");

  console.log(code);

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
    })
    .catch((error) => {
      console.log(error);
      push("/login");
    });
</script>
