const express = require('express'); //inpoirtation de espress
const bodyParser = require('body-parser')
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(function (req, res, next) {
    console.log('requête reçue!');
    next();

});

app.use(function (req, res, next) {
    res.json({
        message: 'votre requête a bien été reçue!'
    })
})

module.exports = app;