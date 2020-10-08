from flask import Flask, flash, render_template, request, redirect
from data import queries
from util import json_response
import math
from dotenv import load_dotenv

load_dotenv()
app = Flask('codecool_series')
max_show_count = 100
shows_on_page = 15


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/shows/most-rated/<offset>/<order>/<direction>')
@json_response
def get_shows(offset, order, direction):
    data = queries.get_shows(offset, order, direction)
    return data

@app.route('/seasons/<show_id>')
@json_response
def get_seasons(show_id):
    return queries.get_seasons(show_id)

@app.route('/show/<show_id>')
@json_response
def render_show(show_id):
    show_details = queries.get_show(show_id)
    return show_details


def main():
    app.run(debug=False)


if __name__ == '__main__':
    app.run(
        host='127.0.0.1',
        port=5020,
        debug=True,
    )
