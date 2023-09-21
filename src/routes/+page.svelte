<script lang="ts">
	let nameInput = '';
	import { OpenMetereologyApi, getCoordinatesFromName } from '$lib/api';
	import WeatherCard from '$lib/components/weatherCard.svelte';
	import type { GeoCodingEntry } from '$lib/dto/geocoding.dto';
	import { citiesStore } from '$lib/stores/cities.store';
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

<h1>Temperaturas mínimas e máximas</h1>
<input bind:value={nameInput} />
<button on:click={searchCity}>Buscar cidade</button>
{#if geoCodingValues.length > 0}
	<select bind:value={selectedCity}>
		{#each geoCodingValues as geoCodingValue}
			<option value={geoCodingValue}>{getName(geoCodingValue)}</option>
		{/each}
	</select>
	<button on:click={addToList}>Get Forecast!</button>
{/if}
<br />
{#each $citiesStore as storeEntry}
	<WeatherCard geoCode={storeEntry} />
{/each}
