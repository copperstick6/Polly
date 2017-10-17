import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { LineChart, Line } from 'recharts';
var request = require('request')
var Loader = require('react-loader');

class App extends Component {
	constructor(props){
		super(props);
		this.state={
			loaded : false,
			mostRecent: null,
			allLines: null,
			cons: [],
			libert: [],
			liberal: [],
			green: []
		}
	}

	componentDidMount(){
		var options = { method: 'GET',
		url: 'http://fd13720f.ngrok.io/getAll'}
		request(options, function (error, response, body) {
			response = JSON.parse(body)
			this.setState({mostRecent: response[0][response[0].length - 1]})
			this.setState({allLines: response[0]})
			this.setState({loaded: true})
			for(var i = 0; i < response[1].length; i++){
				response[1][0]
			}
		}.bind(this));
	}
  render() {
    return (
      <div className="App">
	  <Loader loaded={this.state.loaded}>
        <header className="App-header">
          <h1 className="App-title">Welcome to Polly</h1>
        </header>
		</Loader>
      </div>
    );
  }
}

export default App;
