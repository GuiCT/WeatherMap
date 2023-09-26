<script lang="ts">
	let nameInput = '';
	import { getCoordinatesFromName } from '$lib/api';
	import WeatherCard from '$lib/components/weatherCard.svelte';
	import type { GeoCodingEntry } from '$lib/dto/geocoding.dto';
	import { citiesStore } from '$lib/stores/cities.store';
	import Plus from 'virtual:icons/bi/plus';
	import Search from 'virtual:icons/bi/search';
	let geoCodingValues: Array<GeoCodingEntry> = [];
	let selectedCity: GeoCodingEntry | null = null;
	const searchCity = async () => {
		geoCodingValues = (await getCoordinatesFromName(nameInput)) ?? [];
		selectedCity = geoCodingValues[0];
	};
	const getName = (info: GeoCodingEntry) => {
		let str = `${info.name} - ${info.country}`;
		if (info.admin1) {
			str += `, ${info.admin1}`;
		}
		if (info.admin2) {
			str += `, ${info.admin2}`;
		}
		if (info.admin3) {
			str += `, ${info.admin3}`;
		}
		return str;
	};
	const addToList = async () => {
		if (!selectedCity) return;
		citiesStore.addEntry(selectedCity);
	};
</script>

<head>
	<title>Previsão do tempo</title>
</head>

<main>
	<div class="row-spaced">
		<input bind:value={nameInput} />
		<button on:click={searchCity}><Search /></button>
	</div>
	{#if geoCodingValues.length > 0}
		<div class="row-spaced">
			<select bind:value={selectedCity}>
				{#each geoCodingValues as geoCodingValue}
					<option value={geoCodingValue}>{getName(geoCodingValue)}</option>
				{/each}
			</select>
			<button on:click={addToList}><Plus /></button>
		</div>
	{/if}
	<br />
	<div class="content">
		{#each $citiesStore as storeEntry}
			<WeatherCard geoCode={storeEntry} />
		{/each}
	</div>
</main>

<style lang="scss">
	.content {
		margin-top: 20px;
		display: flex;
		flex-direction: row;
		gap: 20px;
		flex-wrap: wrap;
		justify-content: center;
		width: 100%;
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px;
		gap: 20px;
	}

	.row-spaced {
		display: flex;
		flex-direction: row;
		gap: 20px;
	}

	select,
	input,
	button {
		padding: 8px;
		border-radius: 8px;
	}

	input {
		&:hover {
			outline: solid 1px #ff460e;
		}

		&:focus {
			outline: solid 2px #ff460e;
		}
	}

	button {
		background-color: #ffffff;

		&:hover {
			background-color: #ff460e;
			color: #ffffff;
		}

		&:active {
			background-color: #824d3c;
			color: #ffffff;
		}
	}
</style>
