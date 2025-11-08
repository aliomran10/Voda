const express = require('express');
const app = express();
const PORT = 4454;
const citiesWeather = require('./weather_cities.json');

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept');
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  next();
});

app.get('/forecast', (req, res) => {
  res.send(citiesWeather);
});

app.get('/cityForecast/:cityId', (req, res) => {
  const foundCity = findCity(req, res);

  res.send(foundCity);
});


function findCity(req, res) {
  const cityId = parseInt(req.params.cityId);
  const foundCity = citiesWeather.find(it => it.id === cityId);
  if (!foundCity) {
    throw res.status(404).send({errorMessage: `City does not exist`});
  }
  return foundCity;
}

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
