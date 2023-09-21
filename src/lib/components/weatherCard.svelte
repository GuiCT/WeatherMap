<script lang="ts">
	import { OpenMetereologyApi } from '$lib/api';
	import type { GeoCodingEntry } from '$lib/dto/geocoding.dto';
	import type { OpenMetereologyResponse } from '$lib/dto/open-meteorology.dto';
	import { onMount } from 'svelte';

	export let geoCode: GeoCodingEntry;
	let openMeteoreologyApiInstance: OpenMetereologyApi;
	let weatherData: OpenMetereologyResponse | undefined;
	let loading: boolean = true;

	onMount(async () => {
		openMeteoreologyApiInstance = new OpenMetereologyApi(geoCode.latitude, geoCode.longitude);
		loading = true;
		weatherData = await openMeteoreologyApiInstance.getForecast().then(
			(response) => {
				loading = false;
				return response;
			},
			(error) => {
				loading = false;
				console.error(error);
				return undefined;
			}
		);
	});
</script>

<div>
	<h1>{geoCode.name}</h1>
	{#if !weatherData}
		{#if loading}
			<h2>Carregando...</h2>
		{:else}
			<h2>Não foi possível carregar as informações.</h2>
		{/if}
	{:else}
		{#each Array(weatherData.daily?.time.length ?? 0) as _, idx}
			<h2>{weatherData.daily?.time[idx]}</h2>
			<p>Mínima: {weatherData.daily?.temperature_2m_min[idx]} °C</p>
			<p>Máxima: {weatherData.daily?.temperature_2m_max[idx]} °C</p>
		{/each}
	{/if}
</div>
