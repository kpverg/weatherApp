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

  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data && data.length > 0) {
    return {
      name: data[0].name,
      local_names: data[0].local_names || {},
    };
  }

  return null;
}
