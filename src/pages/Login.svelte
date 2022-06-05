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

  async function githubLogin() {
    let success = await placemarkService.githubLogin();
    if (success) {
      push("/map");
    } else {
      errorMessage = "Invalid Credentials";
    }
  }
</script>

<div class="container is-max-desktop">
  <div class="left">
    {#if errorMessage}
      <div class="section">
        {errorMessage}
      </div>
    {/if}
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
  </div>
  <div class="spacer" />
  <div class="right">
    <div class="section">
      <h1 class="title">
        <a href="/">OAuth Login</a>
      </h1>
      <p class="subtitle">Log in with your GitHub account to get started.</p>
      <button class="button is-link" on:click={githubLogin}>Log In</button>
    </div>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 50vh;
  }

  .left {
    width: 50%;
    padding: 1rem;
    padding-right: 2rem;
  }

  .right {
    width: 50%;
    padding: 1rem;
    border-left: 1px solid #e0e0e0;
  }

  .spacer {
    flex: 1;
  }
</style>
