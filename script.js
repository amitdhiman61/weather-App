function getWeather() {
  const city = document.getElementById('cityInput').value || 'London';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => {
      const temp = Math.round(data.main.temp);
      const description = data.weather[0].description;
      const cityName = data.name;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
      const clouds = data.clouds.all;
      const tempMax = Math.round(data.main.temp_max);

      document.getElementById('temperature').innerText = `${temp}°C`;
      document.getElementById('cityName').innerText = cityName;
      document.getElementById('description').innerText = description;

      document.querySelector('.now div:nth-child(3)').innerText = `${temp}°C`;
      document.querySelector('.humidity div:nth-child(3)').innerText = `${humidity}%`;
      document.querySelector('.wind-speed div:nth-child(3)').innerText = `${windSpeed} m/s`;
      document.querySelector('.clouds div:nth-child(3)').innerText = `${clouds}%`;
      document.querySelector('.max-temp div:nth-child(3)').innerText = `${tempMax}°C`;

      // ✅ Get AQI
      const lat = data.coord.lat;
      const lon = data.coord.lon;

      fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(res => res.json())
        .then(airData => {
          const aqi = airData.list[0].main.aqi;
          let aqiText = '';
          switch (aqi) {
            case 1: aqiText = 'Good 😃'; break;
            case 2: aqiText = 'Fair 🙂'; break;
            case 3: aqiText = 'Moderate 😐'; break;
            case 4: aqiText = 'Poor 😷'; break;
            case 5: aqiText = 'Very Poor 😵'; break;
            default: aqiText = 'Unknown';
          }
          document.querySelector('.air-quality div:nth-child(3)').innerText = aqiText;
        });

      // ✅ Fetch hourly forecast
      function getHourlyForecast(city) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

        fetch(url)
          .then(res => res.json())
          .then(data => {
            const timeRow = document.getElementById('hourlyTimeRow');
            const iconRow = document.getElementById('hourlyIconRow');
            const tempRow = document.getElementById('hourlyTempRow');

            timeRow.innerHTML = '';
            iconRow.innerHTML = '';
            tempRow.innerHTML = '';

            const hourlyData = data.list.slice(0, 8); // next 8 entries (every 3 hours)

            hourlyData.forEach(hour => {
              const date = new Date(hour.dt * 1000);
              const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const temp = Math.round(hour.main.temp);
              const iconCode = hour.weather[0].icon;

              timeRow.innerHTML += `<div>${time}</div>`;
              iconRow.innerHTML += `<div><img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" width="40"/></div>`;
              tempRow.innerHTML += `<div>${temp}°C</div>`;
            });
          })
          .catch(err => console.error('Hourly forecast error:', err));
      }
      

      getHourlyForecast(cityName);
    })
    .catch(error => {
      alert('Error: ' + error.message);
      console.error(error);
    });
}
