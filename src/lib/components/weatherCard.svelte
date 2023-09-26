<script lang="ts">
	import { OpenMetereologyApi } from '$lib/api';
	import type { GeoCodingEntry } from '$lib/dto/geocoding.dto';
	import { mapMetricName, transformMetric } from '$lib/dto/open-meteorology.dto';

	export let geoCode: GeoCodingEntry;
	$: fetchPromise = new OpenMetereologyApi(
		geoCode.latitude,
		geoCode.longitude,
		forecastDays
	).getForecast();
	let forecastDays: number = 7;

	import Trash from 'virtual:icons/bi/trash'; // -> Ícone bootstrap para remoção
	// -> Ícone bootstrap para atualização
	import { citiesStore } from '$lib/stores/cities.store';
</script>

<div class="box">
	<div class="row">
		<h1>{geoCode.name}</h1>
		<input type="range" min="1" max="16" bind:value={forecastDays} />
		{forecastDays}
		<button class="color-white" on:click={() => citiesStore.deleteById(geoCode.id)}>
			<Trash />
		</button>
	</div>
	{#await fetchPromise}
		<h2>Carregando...</h2>
	{:then weatherData}
		{#if !weatherData}
			<h2>Não foi possível carregar as informações.</h2>
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
	{:catch error}
		<h2>Ocorreu um erro!</h2>
		<p>{error}</p>
	{/await}
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
