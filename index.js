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
	  app.tell(app.data.politics)
	  indico.analyzeText(
    [
        String(app.data.politics)
    ],
    {apis: ['sentiment_hq', 'political', 'keywords']}
	)
	.then(function(response){
	app.tell(String(JSON.parse(response)))
	})
}

  let actionMap = new Map();
  actionMap.set(LISTEN_INTENT, listenIntent)
  actionMap.set(WELCOME_INTENT, welcomeIntent)
  app.handleRequest(actionMap);
}
