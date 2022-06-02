<script>
  import axios from "axios";
  import { onMount } from "svelte";
  export let place;

  let weatherByLatLng;

  onMount(async () => {
    weatherByLatLng = await axios
      .get(
        `https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?lat=${
          place.location.lat
        }&lon=${place.location.lng}&appid=${
          import.meta.env.VITE_WEATHERAPI_KEY
        }`
      )
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  });

  const kelvinToCelsius = (kelvin) => {
    return Math.round(kelvin - 273.15);
  };

  console.log(weatherByLatLng);
</script>

{#if !weatherByLatLng}
  <p>Loading weather...</p>
{:else}
  <div>
    <h3>Weather for {place.name} provided by Open Weather Map API</h3>
    <div class="weather">
      <img
        src={`https://openweathermap.org/img/w/${weatherByLatLng.weather[0].icon}.png`}
        alt={weatherByLatLng.weather[0].description}
      />
    </div>
    <div class="temperature">
      <div>
        {kelvinToCelsius(Math.round(weatherByLatLng.main.temp))} &deg;C
      </div>
      <div>
        {kelvinToCelsius(Math.round(weatherByLatLng.main.temp_min))} &deg;C
      </div>
      <div>
        {kelvinToCelsius(Math.round(weatherByLatLng.main.temp_max))} &deg;C
      </div>
    </div>
  </div>
{/if}
