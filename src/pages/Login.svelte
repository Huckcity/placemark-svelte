<script>
  import { push } from "svelte-spa-router";
  import { getContext } from "svelte";

  let email = "";
  let password = "";
  let errorMessage = "";

  const placemarkService = getContext("PlacemarkService");

  async function login() {
    let success = await placemarkService.login(email, password);
    if (success) {
      push("/map");
    } else {
      email = "";
      password = "";
      errorMessage = "Invalid Credentials";
    }
  }
</script>

<div class="container is-max-desktop">
  <form on:submit|preventDefault={login}>
    <div class="field">
      <label for="email" class="label">Email</label>
      <input
        bind:value={email}
        id="email"
        class="input"
        type="text"
        placeholder="Enter email"
        name="email"
      />
    </div>
    <div class="field">
      <label for="password" class="label">Password</label>
      <input
        bind:value={password}
        id="password"
        class="input"
        type="password"
        placeholder="Enter Password"
        name="password"
      />
    </div>
    <div class="field is-grouped">
      <button class="button is-link">Log In</button>
    </div>
  </form>
  {#if errorMessage}
    <div class="section">
      {errorMessage}
    </div>
  {/if}
</div>
