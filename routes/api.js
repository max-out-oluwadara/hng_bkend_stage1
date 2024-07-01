const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

// Weather API_KEY from 'https://home.openweathermap.org/'
const temApiKey = process.env.API_KEY


// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

// Function to roundup decimal the nearest integer
function roundToWhole(number) {
        return Math.round(number);
    }

// Function to remove forward slapash/'' from name
function sanitizeVisitorName(name) {
        return name.replace(/['"]/g, '');
    }

//  @route GET api/hello
//  Queryparameter visitor_name
// Key can be any variable
router.get('/', async (req, res) => {

    const client_ip = '102.89.32.137' //req.connection.remoteAddress || req.headers['x-forwarded-for']  

    let visitorName = req.query.visitor_name;

    if (visitorName) {

        visitorName = sanitizeVisitorName(visitorName);

        visitorName = capitalizeFirstLetter(visitorName);

    try {
        const ipUrlApi = `https://freeipapi.com/api/json/${client_ip}`
        const response = await axios.get(ipUrlApi);
        const payload = response.data;
        const {cityName,latitude,longitude} = payload

        const temUrlApi = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${temApiKey}`
        const response2 = await axios.get(temUrlApi)
        const tempAbsolute = response2.data.main.temp
        let tempCelcius = tempAbsolute - 273.15
        tempCelcius = roundToWhole(tempCelcius)
        

        res.json({
            "client_ip": `${client_ip}`, // The Ip address of the requester
            "location": `${cityName}`, // The city of the requester
            "greeting": `Hello, ${visitorName}!, the temperature is ${tempCelcius} degrees Celcius in ${cityName}`
        });

    } catch (err) {
        console.error(err.message)
        res.status(401).json({msg: "Ip is not Valid"})
    }

      
    } else {
      res.status(400).send('Bad Request: visitor_name query parameter is required.');
    }
});

module.exports = router;