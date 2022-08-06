const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const PORT = process.env.PORT || 3000;
require('dotenv').config()

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.render("home");
})

app.post("/", (req, res) => {
    const query = req.body.cityName;
    const unit = req.body.unit;
    console.log(unit);
    console.log(query);
    const apikey = process.env.API_KEY;
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apikey + "&units=" + unit;


    https.get(url, (response) => {
        response.on("data", (data) => {
            const weatherData = JSON.parse(data);   // converted to JS obj
            const code = weatherData.cod;
            if (code != 200) {
                res.render("error");
                return;
            }
            const weatherDes = weatherData.weather[0].description;
            const temp = weatherData.main.temp;
            const icon = weatherData.weather[0].icon;
            const iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            const temp_max = weatherData.main.temp_max;
            const temp_min = weatherData.main.temp_min;
            const pressure = weatherData.main.pressure;
            const humidity = weatherData.main.humidity;


            res.render("info", { cityName: query, icon: iconURL, temp: temp, desc: weatherDes, tempMx: temp_max, tempMn: temp_min, pre: pressure, hum: humidity, unit: unit });
        })
    }).on('error', (e) => {
        console.error(e);
    });
})


app.listen(PORT, () => {
    console.log(`Server running at port: ${PORT}`);
})

