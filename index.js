'use strict';

const ApiAiApp = require('actions-on-google').ApiAiApp

var request = require('request');
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
		response = JSON.parse(body)
		let mood = "sad"
		let keywords = "";
		let max = 1
		let party = ""
		if (parseFloat(response['sentiment_hq']) > parseFloat(0.5)){
			mood = "happy"
		}
		for(var i in response['keywords']){
			keywords+= i
			keywords +=" "
		}
		for(var j in response['political']){
			if(parseFloat(response['political'][j]) > .05){
				if(parseFloat(response['political'][j]) > .5){
					party+= " strongly " + j + " with a value of " + parseFloat(response['political'][j]).toFixed(4)
				}
				party+=j
				party += ", "
			}
		}
  	app.tell("Analysis: The general mood seems to be: " + String(mood) + ". The keywords are: " + String(keywords) + " The conversation is "  String(party) + " with a value of " + String(max.toFixed(4)))
	});
}

  let actionMap = new Map();
  actionMap.set(LISTEN_INTENT, listenIntent)
  actionMap.set(WELCOME_INTENT, welcomeIntent)
  app.handleRequest(actionMap);
}
