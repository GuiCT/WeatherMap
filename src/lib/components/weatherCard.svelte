<script lang="ts">
	import { OpenMetereologyApi } from '$lib/api';
	import type { GeoCodingEntry } from '$lib/dto/geocoding.dto';
	import type { OpenMetereologyResponse } from '$lib/dto/open-meteorology.dto';
	import { onMount } from 'svelte';

	export let geoCode: GeoCodingEntry;
	let openMeteoreologyApiInstance: OpenMetereologyApi;
	let weatherData: OpenMetereologyResponse | undefined;

	onMount(async () => {
		openMeteoreologyApiInstance = new OpenMetereologyApi(geoCode.latitude, geoCode.longitude);
		weatherData = await openMeteoreologyApiInstance.getForecast();
	});
</script>

<div>
	<h1>{geoCode.name}</h1>
  {#if !weatherData}
    <h2>Não há informações disponíveis.</h2>
  {:else}
    {#each Array(weatherData.daily?.time.length ?? 0) as _, idx}
      <h2>{weatherData.daily?.time[idx]}</h2>
      <p>Mínima: {weatherData.daily?.temperature_2m_min[idx]} °C</p>
      <p>Máxima: {weatherData.daily?.temperature_2m_max[idx]} °C</p>
    {/each}
  {/if}
</div>
