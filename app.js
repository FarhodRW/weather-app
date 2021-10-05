const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser());

app.get("/", function(req,res){
res.sendFile(__dirname+'/');
});

app.post("/", function(req,res){
  console.log(req.body);
const query = req.body.cityName;
console.log(query, 'city name keldi');
const apiKey = "f413e19a66563d5d3b428d612d8d59e9";
const units = "metric";
const url =
  "https://api.openweathermap.org/data/2.5/weather?q=" +
  query +
  "&appid=" +
  apiKey +
  "&units=" +
  units;

https.get(url, function (response) {
  console.log(response.statusCode);
  response.on("data", function (data) {
    console.log("dataaa", JSON.parse(data));
    if (JSON.parse(data).cod == 200) {
      console.log(JSON.parse(data));
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const descript = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      const windSpeed = weatherData.wind.speed;
      const res_data = {
        temp,
        description: descript,
        iconURL,
        city_name: weatherData.name,
        country: weatherData.sys.country,
        windSpeed,
      };
      res.send(res_data);
    } else {
      res.statusCode = 404;
      res.send({ message: "City not found" });
    }
  });
});

});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000")
});