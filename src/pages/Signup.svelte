<script>
  import { push } from "svelte-spa-router";
  import { getContext } from "svelte";

  let username = "";
  let email = "";
  let password = "";
  let repeatPassword = "";
  let errorMessage = "";

  const placemarkService = getContext("PlacemarkService");

  async function signup() {
    let success = await placemarkService.signup(
      username,
      email,
      password,
      repeatPassword
    );
    if (success) {
      push("/");
    } else {
      errorMessage = "Error Trying to sign up";
    }
  }
</script>

<div class="container is-max-desktop">
  <form on:submit|preventDefault={signup}>
    <div class="field is-horizontal">
      <div class="field-body">
        <div class="field">
          <label for="firstname" class="label">First Name</label>
          <input
            bind:value={username}
            id="username"
            class="input"
            type="text"
            placeholder="Enter Username"
            name="username"
          />
        </div>
      </div>
    </div>
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
    <div class="field">
      <label for="password" class="label">Repeat Password</label>
      <input
        bind:value={repeatPassword}
        id="repeatPassword"
        class="input"
        type="password"
        placeholder="Repeat Password"
        name="repeatPassword"
      />
    </div>
    <div class="field is-grouped">
      <button class="button is-link">Sign Up</button>
    </div>
  </form>
  {#if errorMessage}
    <div class="section">
      {errorMessage}
    </div>
  {/if}
</div>
