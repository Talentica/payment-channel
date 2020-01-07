#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Apr  4 14:09:35 2019

@author: gaurava
"""
# from flask_cors import CORS
from uuid import uuid4
import re
from flask import Flask, request, jsonify

from Redis.RedisHandler import RedisHandler

# os.system("clear")

# Instantiate the Node
app = Flask(__name__)
node_identifier = str(uuid4()).replace('-', '')
redis_handler = RedisHandler()


def add_headers_to_fontawesome_static_files(response):
    """
    Fix for font-awesome files: after Flask static send_file() does its
    thing, but before the response is sent, add an
    Access-Control-Allow-Origin: *
    HTTP header to the response (otherwise browsers complain).
    """

    if (request.path and
            re.search(r'\.(ttf|woff|svg|eot)$', request.path)):
        response.headers.add('Access-Control-Allow-Origin', '*')

    return response


# if app.debug:
app.after_request(add_headers_to_fontawesome_static_files)


@app.route('/fetch_request', methods=['POST'])
def fetch_request():
    _address = request.form['address']
    _request_type = request.form['request_type']
    fetched_request = redis_handler.get_list_value(_address, _request_type)
    str_requests = []
    for each in fetched_request:
        str_requests.append(each.decode("utf-8"))
    response = jsonify(str_requests)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/set_request', methods=['POST'])
def set_request():
    _address = request.form['address']
    _request_type = request.form['request_type']
    _request_data = request.form['request_data']
    index = redis_handler.set_list_value(_address, _request_type, _request_data)
    payload = {'index': index}
    response = jsonify(payload)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/update_request', methods=['POST'])
def update_request():
    _address = request.form['address']
    _request_type = request.form['request_type']
    _index = request.form['index']
    _request_data = request.form['request_data']
    index = redis_handler.update_list_value(_address, _request_type, _index, _request_data)
    payload = {'index': index}
    response = jsonify(payload)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/delete_request', methods=['POST'])
def delete_request():
    _address = request.form['address']
    _request_type = request.form['request_type']
    _index = request.form['index']
    index = redis_handler.delete_list_value(_address, _request_type, _index)
    payload = {'index': index}
    response = jsonify(payload)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/publish', methods=['POST'])
def publish():
    _address = request.form['address']
    _request_data = request.form['request_data']
    index = redis_handler.publish_data(_address, _request_data)
    payload = {'index': index}
    response = jsonify(payload)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/subscribe', methods=['POST'])
def subscribe():
    _address = request.form['address']
    index = redis_handler.subscribe_channel(_address)
    payload = {'index': index}
    response = jsonify(payload)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/unsubscribe', methods=['POST'])
def unsubscribe():
    _address = request.form['address']
    index = redis_handler.unsubscribe_channel(_address)
    payload = {'index': index}
    response = jsonify(payload)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/', methods=['POST'])
def check_point():
    payload = {'index': "index"}
    response = jsonify(payload)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == '__main__':
    from argparse import ArgumentParser

    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5002, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port
    app.run(host='0.0.0.0', port=port)
