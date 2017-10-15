'use strict';

const ApiAiApp = require('actions-on-google').ApiAiApp

var request = require('request');
var indico = require('indico.io');
indico.apiKey =  'ac848d3569d2ba24acc5e274a0b6676d';
const WELCOME_INTENT = 'input.welcome'; //this is the name rom the API.AI intent. check the API.AI event console.
const LISTEN_INTENT = 'input.listen'

exports.polly = (req, res) => {
  const app = new ApiAiApp({ request: req, response: res});
  function welcomeIntent(app){
    app.ask('Got it. We\'re listening. Keep the app open and we\'ll analyze everything we get')
  }
  function listenIntent(app){
	  var options = { method: 'POST',
  url: 'http://fd13720f.ngrok.io/setData',
  headers:
   { 'postman-token': '9c7b96c6-d64d-cc20-09d1-63e791da8d32',
     'cache-control': 'no-cache',
     'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
  formData: { politics: app.data.politics } };

	request(options, function (error, response, body) {
  	app.tell("We got your data, go ahead and navigate to our website for more info.")
	});
}

  let actionMap = new Map();
  actionMap.set(LISTEN_INTENT, listenIntent)
  actionMap.set(WELCOME_INTENT, welcomeIntent)
  app.handleRequest(actionMap);
}
