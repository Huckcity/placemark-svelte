<script>
  import axios from "axios";
  import { onMount } from "svelte";
  import Charts from "./Charts.svelte";
  import { prettyDate, defaultDate, kelvinToCelsius } from "../services/utils";
  export let place;

  let weatherByLatLng, fiveDayForecast;

  onMount(async () => {
    weatherByLatLng = await axios
      .get(
        `https://cors-anyhuck.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?lat=${
          place.location.lat
        }&lon=${place.location.lng}&appid=${
          import.meta.env.VITE_WEATHERAPI_KEY
        }`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    fiveDayForecast = await axios
      .get(
        `https://cors-anyhuck.herokuapp.com/https://api.openweathermap.org/data/2.5/forecast?lat=${
          place.location.lat
        }&lon=${place.location.lng}&cnt=5&appid=${
          import.meta.env.VITE_WEATHERAPI_KEY
        }`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  });
</script>

{#if weatherByLatLng}
  <div>
    <!-- start current weather tile -->
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box" style="text-align:center">
          <div class="columns is-vcentered">
            <div class="column">
              <p class="title">
                {place.name}
              </p>
              <p class="subtitle">
                {prettyDate(Date.now())}
              </p>
              <img
                id="currentIcon"
                style="margin-top: -1.5em"
                src="https://openweathermap.org/img/wn/{weatherByLatLng
                  .weather[0].icon}@2x.png"
                alt={weatherByLatLng.weather[0].description}
              />
            </div>
            <div class="column" style="font-weight:600;">
              <div id="currentTemperature">
                Temperature: {kelvinToCelsius(weatherByLatLng.main.temp)}°C
              </div>
              <div id="currentHumidity">
                Humidity: {weatherByLatLng.main.humidity}%
              </div>
              <div id="currentWindSpeed">
                Wind Speed: {weatherByLatLng.wind.speed}m/s
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
    <!-- end current weather tile -->

    {#if fiveDayForecast}
      <!-- start 5 day forecast tile -->
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <article class="tile is-child" style="text-align:center">
            <p class="subtitle" style="font-weight: 600">5 Day Forecast</p>
          </article>
        </div>
      </div>
      <div class="tile is-ancestor">
        {#each fiveDayForecast.list as day}
          <div class="tile is-parent">
            <article
              class="tile is-child box"
              id="day1"
              style="text-align:center"
            >
              <div class="columns is-vcentered">
                <div class="column">
                  <p>
                    {defaultDate(day.dt * 1000)}
                  </p>
                  <img
                    id="day1Icon"
                    style="margin-top: -1.5em"
                    src="https://openweathermap.org/img/wn/{day.weather[0]
                      .icon}@2x.png"
                    alt={day.weather[0].description}
                  />
                  <p>
                    {kelvinToCelsius(day.main.temp)}°C / {day.main.humidity}%
                  </p>
                  {day.weather[0].description}
                </div>
              </div>
            </article>
          </div>
        {/each}
      </div>
      <!-- end 5 day tile -->
      <Charts {fiveDayForecast} />
    {/if}
  </div>
  <br />
{:else}
  <p class="title has-text-centered">Loading weather...</p>
  <progress class="progress is-large is-dark" max="100">Loading...</progress>
{/if}
