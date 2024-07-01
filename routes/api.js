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

    const client_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;  // eg '102.89.32.137' 
    console.log(client_ip)

    let visitorName = req.query.visitor_name;
     // If VistorName exist in the query parameter
    if (visitorName) {

        visitorName = sanitizeVisitorName(visitorName);

        visitorName = capitalizeFirstLetter(visitorName);

    try {
        //Reguest to IP api
        const ipUrlApi = `https://freeipapi.com/api/json/${client_ip}`
        const response = await axios.get(ipUrlApi);
        const payload = response.data;
        const {cityName,latitude,longitude} = payload

        //Request to Weather Api
        const temUrlApi = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${temApiKey}`
        const response2 = await axios.get(temUrlApi)
        const tempAbsolute = response2.data.main.temp

        // Converting absolute temperate to celcius
        let tempCelcius = tempAbsolute - 273.15

        //rounding up celcius temperature to whole number
        tempCelcius = roundToWhole(tempCelcius)
        
        // Api json response after getting the ip address and temp celcius
        res.json({
            "client_ip": `${client_ip}`, // The Ip address of the requester
            "location": `${cityName}`, // The city of the requester
            "greeting": `Hello, ${visitorName}!, the temperature is ${tempCelcius} degrees Celcius in ${cityName}`
        });

    } catch (err) {
        console.error(err.message)
        res.status(401).json({msg: "Ip is not Valid"})
    }

    // If Vistors name doesn's exsist in the query parameter
    } else {
      res.status(400).send('Bad Request: visitor_name query parameter is required.');
    }
});

module.exports = router;