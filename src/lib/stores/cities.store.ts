import { browser } from "$app/environment";
import type { GeoCodingEntry } from "$lib/dto/geocoding.dto";
import { writable } from "svelte/store";

let storeInitialValue: Array<GeoCodingEntry> = [];
if (browser) {
  const citiesFromLocalStorage = localStorage.getItem("cities");
  storeInitialValue = JSON.parse(citiesFromLocalStorage ?? "[]");
}
const _citiesStore = writable<Array<GeoCodingEntry>>(storeInitialValue);
_citiesStore.subscribe((value) => {
  if (browser) {
    localStorage.setItem("cities", JSON.stringify(value));
  }
});

// !ATIVIDADES
// Atividades para o mini curso
// Utilizar a função deleteById para remover uma cidade da lista
// Utilizar a função clear para limpar a lista de cidades
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
