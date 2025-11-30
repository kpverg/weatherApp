// src/services/apiService.js
export async function fetchWeather(lat, lon, apiKey) {
  if (!apiKey) throw new Error('Missing API Key');

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  return data;
}
