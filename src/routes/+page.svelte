<script lang="ts">
	let nameInput = '';
	import { OpenMetereologyApi, getCoordinatesFromName } from '$lib/api';
	import type { GeoCodingEntry } from '$lib/dto/geocoding.dto';
	let geoCodingValues: Array<GeoCodingEntry> = [];
  let selectedCity: GeoCodingEntry | null = null;
  const searchCity = async () => {
    geoCodingValues = await getCoordinatesFromName(nameInput) ?? [];
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
  }
  const forecast = async () => {
    if (!selectedCity) return;
    const api = new OpenMetereologyApi(selectedCity.latitude, selectedCity.longitude);
    const data = await api.getForecast();
    alert(JSON.stringify(data));
  }
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
  <button on:click={forecast}>Get Forecast!</button>
{/if}
