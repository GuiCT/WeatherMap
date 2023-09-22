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

	function mapTemperatureToClass(temperature: number): 'veryhot' | 'hot' | 'warm' | 'cold' | 'verycold' {
		if (temperature > 35) {
			return 'veryhot';
		}

		if (temperature > 25) {
			return 'hot';
		}

		if (temperature > 15) {
			return 'warm';
		}

		if (temperature > 5) {
			return 'cold';
		}

		return 'verycold';
	}
</script>

<div class="box">
	<h1>{geoCode.name}</h1>
	{#if !weatherData}
		{#if loading}
			<h2>Carregando...</h2>
		{:else}
			<h2>Não foi possível carregar as informações.</h2>
		{/if}
	{:else}
		<table>
			<thead>
				<tr>
					{#each Object.keys(weatherData.daily ?? {}) as key}
						<th>{key}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each Array(weatherData.daily?.time.length ?? 0) as _, idx}
					<tr>
						{#each Object.keys(weatherData.daily ?? {}) as key}
							<td>{weatherData.daily?.[key][idx]}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>		
	{/if}
</div>

<style lang="scss">
	.box {
		padding: 20px;
		box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.33);
		min-width: fit-content;
		max-width: 40%;

		h1 {
			margin: 0;
		}
	}

	td {
		text-align: center;
	}
</style>