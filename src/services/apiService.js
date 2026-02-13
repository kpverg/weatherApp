// src/services/apiService.js
export async function fetchWeather(lat, lon, apiKey) {
  if (!apiKey) throw new Error('Missing API Key');

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  return data;
}

export async function reverseGeocode(lat, lon, apiKey) {
  if (!apiKey) throw new Error('Missing API Key');

  // Increase limit to see if we get better matches
  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.length > 0) {
      // Try to find the best entry: one that has local_names.el
      const bestEntry = data.find(item => item.local_names && item.local_names.el) || data[0];
      
      let grName = bestEntry.local_names?.el || bestEntry.name;
      
      // Clean up common repetitive suffixes OpenWeather might return
      grName = grName
        .replace(/ Δήμος/g, '')
        .replace(/Δήμος /g, '')
        .replace(/ Δημοτική Ενότητα/g, '')
        .replace(/Δημοτική Ενότητα /g, '');

      return {
        name: bestEntry.name,
        local_names: bestEntry.local_names || {},
        state: bestEntry.state,
        country: bestEntry.country,
        cleanNameGr: grName
      };
    }
  } catch (error) {
    console.error('Reverse Geocode Error:', error);
  }

  return null;
}

export async function searchCitiesOnline(query, apiKey) {
  if (!apiKey || query.length < 3) return [];

  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)},GR&limit=5&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.length > 0) {
      return data.map(item => ({
        gr: item.local_names?.el || item.name,
        en: item.name,
        lat: item.lat,
        lon: item.lon,
        state: item.state,
        isOnline: true
      }));
    }
  } catch (error) {
    console.error('Online Search Error:', error);
  }

  return [];
}
