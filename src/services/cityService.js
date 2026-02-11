// src/services/cityService.js
import cities from '../data/citiesGR';

const normalizeGreek = text => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

export function searchCities(query) {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const normalizedQuery = normalizeGreek(query);

  return cities
    .filter(city => {
      const enMatch = city.en.toLowerCase().includes(lowerQuery);
      const grMatch = normalizeGreek(city.gr).includes(normalizedQuery);
      return enMatch || grMatch;
    })
    .slice(0, 10);
}

export function searchCitiesGR(query) {
  // We can just use the same robust search now
  return searchCities(query);
}
