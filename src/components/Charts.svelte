<script>
  import { onMount } from "svelte";

  import Chart from "svelte-frappe-charts";
  import { kelvinToCelsius } from "../services/utils";

  export let fiveDayForecast;
  console.log(fiveDayForecast);

  let TABS, CONTENT, ACTIVE_CLASS;

  onMount(async () => {
    TABS = [...document.querySelectorAll("#tabs li")];
    CONTENT = [...document.querySelectorAll("#tab-content p")];
    ACTIVE_CLASS = "is-active";

    initTabs();
  });

  const tempdata = {
    labels: fiveDayForecast.list.map((item) => {
      return item.dt_txt.split(" ")[0];
    }),
    datasets: [
      {
        values: fiveDayForecast.list.map((item) => {
          return kelvinToCelsius(item.main.temp);
        }),
      },
    ],
  };

  const winddata = {
    labels: fiveDayForecast.list.map((item) => {
      return item.dt_txt.split(" ")[0];
    }),
    datasets: [
      {
        values: fiveDayForecast.list.map((item) => {
          return item.wind.speed;
        }),
      },
    ],
  };

  const humiditydata = {
    labels: fiveDayForecast.list.map((item) => {
      return item.dt_txt.split(" ")[0];
    }),
    datasets: [
      {
        values: fiveDayForecast.list.map((item) => {
          return item.main.humidity;
        }),
      },
    ],
  };

  function initTabs() {
    TABS.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        let selected = tab.getAttribute("data-tab");
        updateActiveTab(tab);
        updateActiveContent(selected);
      });
    });
  }

  function updateActiveTab(selected) {
    TABS.forEach((tab) => {
      if (tab && tab.classList.contains(ACTIVE_CLASS)) {
        tab.classList.remove(ACTIVE_CLASS);
      }
    });
    selected.classList.add(ACTIVE_CLASS);
  }

  function updateActiveContent(selected) {
    CONTENT.forEach((item) => {
      if (item && item.classList.contains(ACTIVE_CLASS)) {
        item.classList.remove(ACTIVE_CLASS);
      }
      let data = item.getAttribute("data-content");
      if (data === selected) {
        item.classList.add(ACTIVE_CLASS);
      }
    });
  }
</script>

<div class="tabs is-toggle is-fullwidth" id="tabs">
  <ul>
    <li class="is-active" data-tab="1">
      <!-- svelte-ignore a11y-missing-attribute -->
      <a>
        <span class="icon is-small"><i class="fa fa-thermometer-half" /></span>
        <span>Temperature</span>
      </a>
    </li>
    <li data-tab="2">
      <!-- svelte-ignore a11y-missing-attribute -->

      <a>
        <span class="icon is-small"><i class="fa fa-wind" /></span>
        <span>Wind</span>
      </a>
    </li>
    <li data-tab="3">
      <!-- svelte-ignore a11y-missing-attribute -->

      <a>
        <span class="icon is-small"><i class="fas fa-humidity" /></span>
        <span>Humidity %</span>
      </a>
    </li>
  </ul>
</div>
<div id="tab-content">
  <p class="is-active" data-content="1">
    <Chart data={tempdata} type="line" />
  </p>
  <p data-content="2">
    <Chart data={winddata} type="line" />
  </p>
  <p data-content="3">
    <Chart data={humiditydata} type="line" />
  </p>
</div>

<style>
  #tab-content p {
    display: none;
  }

  #tab-content p.is-active {
    display: block;
  }
</style>
