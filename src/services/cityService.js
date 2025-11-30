// src/services/cityService.js
import cities from '../data/citiesGR';

export function searchCities(query) {
  if (!query.trim()) return [];

  const lower = query.toLowerCase();

  // English search
  return cities.filter(city => city.en.toLowerCase().startsWith(lower));
}

export function searchCitiesGR(query) {
  if (!query.trim()) return [];

  // Simple Greek search - just do a lowercase comparison without normalization
  const lower = query.toLowerCase();

  return cities.filter(city => city.gr.toLowerCase().startsWith(lower));
}
