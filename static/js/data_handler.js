import {dom} from  "./dom.js"

const loadingElem = document.querySelector('.loading')
// loadingElem.style.display = 'none'
export let dataHandler = {
    _data: {}, // it is a "cache for all data received: boards, cards and statuses. It is not accessed from outside.
    _api_get: function (url, callback) {
        loadingElem.style.display = ''
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it
        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'

        })
            .then(response => response.json())  // parse the response as JSON
            .then(json_response => callback(json_response));  // Call the `callback` with the returned object
        // loadingElem.style.display = 'none'
    },

    getMostRatedShows: function (offset = 0, order = 'rating', direction = 'DESC') {
        (parseInt(offset) < 0) ? offset = 0 : 'pass'
        this._api_get(`/shows/most-rated/${offset}/${order}/${direction}`, (shows) => {
            dom.showShows(shows, offset, order, direction)
        })
    },
    getShow: function (show_id) {
        this._api_get(`/show/${show_id}`, (show) => {
            dom.showShow(show)
        })
    },
    getSeasonsByShow: function (show_id) {
        this._api_get(`/seasons/${show_id}`, (seasons) => {
            dom.showSeasons(seasons)
        })
    },
}