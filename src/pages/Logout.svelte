<script>
  import { getContext } from "svelte";
  import { push } from "svelte-spa-router";

  const placemarkService = getContext("PlacemarkService");
  placemarkService.logout();

  push("/");
</script>
