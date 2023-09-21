import type { GeoCodingEntry } from "$lib/dto/geocoding.dto";
import { writable } from "svelte/store";

const _citiesStore = writable<Array<GeoCodingEntry>>([]);

export const citiesStore = {
  subscribe: _citiesStore.subscribe,
  addEntry: (newEntry: GeoCodingEntry) => {
    _citiesStore.update((cities) => {
      if (cities.find((city) => city.id === newEntry.id)) return cities;
      return [...cities, newEntry];
    });
  },
  deleteById: (id: number) => {
    _citiesStore.update((cities) => cities.filter((city) => city.id !== id));
  },
  clear: () => {
    _citiesStore.set([]);
  },
};
