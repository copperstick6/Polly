from flask import Flask, request, render_template, url_for, current_app, make_response
from datetime import timedelta
import json
app = Flask(__name__)
import keys
import urllib2
import requests
import urllib
import random
from flask_cors import CORS
from functools import update_wrapper
import indicoio
indicoio.config.api_key = keys.indicoKey()

def crossdomain(origin=None, methods=None, headers=None, max_age=21600, attach_to_all=True, automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

sentences = []
data = []

@app.route("/getSentences")
@crossdomain(origin='*')
def getChoices():
	return json.dumps(sentences)

@app.route('/getData')
@crossdomain(origin='*')
def getData():
	return str(data)

@app.route('/getAll')
@crossdomain(origin='*')
def getAll():
	return str([sentences, data])


@app.route("/setData", methods=['POST'])
@crossdomain(origin='*')
def setData():
	data.append(json.dumps(indicoio.analyze_text(str(request.form['politics']), apis=['political', 'sentiment_hq', 'keywords'])))
	sentences.append(request.form['politics'])
	return "Got it"

app.run(debug=True, port =5001)
CORS(app)
