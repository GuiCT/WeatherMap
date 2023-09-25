<script lang="ts">
	import { OpenMetereologyApi } from '$lib/api';
	import type { GeoCodingEntry } from '$lib/dto/geocoding.dto';
	import { mapMetricName, transformMetric, type OpenMetereologyResponse } from '$lib/dto/open-meteorology.dto';
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

	// !ATIVIDADES
	// Atividades para o mini curso:
	// 1 - Implementar a remoção de cidades da lista a partir de um ícone localizado no card.
	// 2 - Permitir alterar a quantidade de dias de previsão do tempo a partir de um input localizado no card.
	// Também implementar a atualização da previsão do tempo a partir do novo valor.
	// 3 - Utilizar bloco await ao invés de onMount para carregar as informações.
	// import Trash from 'virtual:icons/bi/trash'; // -> Ícone bootstrap para remoção
	// import Refresh from 'virtual:icons/bi/arrow-counterclockwise' // -> Ícone bootstrap para atualização
</script>

<div class="box">
	<div>
		<h1>{geoCode.name}</h1>

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
	td, th {
		text-align: center;
		padding: 0 50px 0 0;
	}
</style>
