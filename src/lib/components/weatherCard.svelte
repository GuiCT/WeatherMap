<script lang="ts">
	import { OpenMetereologyApi } from '$lib/api';
	import type { GeoCodingEntry } from '$lib/dto/geocoding.dto';
	import {
		mapMetricName,
		transformMetric,
		type OpenMetereologyResponse
	} from '$lib/dto/open-meteorology.dto';
	import { onMount } from 'svelte';

	export let geoCode: GeoCodingEntry;
	let openMeteoreologyApiInstance: OpenMetereologyApi;
	let weatherData: OpenMetereologyResponse | undefined;
	let loading: boolean = true;
	let forecastDays: number = 7;

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

	const refresh = async () => {
		openMeteoreologyApiInstance.forecastDays = forecastDays;
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
	};

	// !ATIVIDADES
	// Atividades para o mini curso:
	// 3 - Utilizar bloco await ao invés de onMount para carregar as informações.
	import Trash from 'virtual:icons/bi/trash'; // -> Ícone bootstrap para remoção
	import Refresh from 'virtual:icons/bi/arrow-counterclockwise'; // -> Ícone bootstrap para atualização
	import { citiesStore } from '$lib/stores/cities.store';
</script>

<div class="box">
	<div class="row">
		<h1>{geoCode.name}</h1>
		<input type="range" min="1" max="16" bind:value={forecastDays} />
		{forecastDays}
		<button class="color-white" on:click={refresh}>
			<Refresh />
		</button>
		<button class="color-white" on:click={() => citiesStore.deleteById(geoCode.id)}>
			<Trash />
		</button>
	</div>
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
						<th>{mapMetricName(key)}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each Array(weatherData.daily?.time.length ?? 0) as _, idx}
					<tr>
						{#each Object.keys(weatherData.daily ?? {}) as key}
							<td>{transformMetric(key, weatherData.daily?.[key][idx])}</td>
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

	table {
		margin-top: 20px;
	}
	td,
	th {
		text-align: center;
		padding: 0 50px 0 0;
	}

	.row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.color-white {
		color: #ffffff;
	}
</style>
