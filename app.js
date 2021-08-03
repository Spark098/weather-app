const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", (req, res) => {
    res.render("home");
})

app.post("/", (req, res) => {
    const query = req.body.cityName;
    const apikey = "412cf66cb09ed4b8cf6d56bd746e83a9";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apikey + "&units=" + unit;


    let temp;
    https.get(url, (response) => {
        
        response.on("data", (data) => {
            const weatherData = JSON.parse(data);   // converted to JSON obj
            const weatherDes = weatherData.weather[0].description;
            temp = weatherData.main.temp;
            const icon = weatherData.weather[0].icon;
            const iconURL =  "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            const temp_max = weatherData.main.temp_max;
            const temp_min = weatherData.main.temp_min;
            const pressure = weatherData.main.pressure;
            const humidity = weatherData.main.humidity;


            console.log(".................................................");
            console.log("TEMPERATURE: " + temp);
            res.render("info", {cityName: query, icon: iconURL, temp: temp, desc: weatherDes, tempMx: temp_max, tempMn: temp_min, pre: pressure, hum: humidity});
            

        })
    })

    
    
})


app.listen(3000, () => {
    console.log("Server running at 3000");
})

