// JavaScript source code
var express = require('express');
var app = express();
var body_parser = require('body-parser');
var request = require('request');

// Loading tokens
var config = require('./config.js').getConfig();

// Import API.AI and identify with token
var apiai = require('apiai');
var api = apiai(config.apiaitoken);

//Set port
app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
app.use(body_parser.urlencoded({ extended: false }));

// Process application/json
app.use(body_parser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Run the server
app.listen(app.get('port'), function () {
    console.log('running on port', app.get('port'))
})

//Process Messages
app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        }
    }
    res.sendStatus(200)
})

//Echo Messages
function sendTextMessage(sender, text) {
    messageData = {
        text: text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: pageAccessToken},
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

