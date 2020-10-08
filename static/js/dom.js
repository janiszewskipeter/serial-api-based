import {dataHandler} from "./data_handler.js";
const showsOnPage = 15
const maxShowsCount = 100



export let dom = {

    init: function () {
        this.loadShows()
    },
    loadShows: function (offset = 0, order = 'rating', direction = 'DESC') {
        // retrieves shows
        dataHandler.getMostRatedShows(offset, order, direction)
        dom.showPagination(showsOnPage, maxShowsCount, offset, order, direction)

    },

    showShows: function (shows, offset, order, direction, indicator = '&#x1F501') {

        offset = parseInt(offset) - showsOnPage
        let showList = '';
        for (let show of shows) {

            showList += `
                
                    <tr>
                        <td ><a class="table-title" id="${show.id}">${show.title}</a></td>
                        <td >${show.year}</td>
                        <td>${show.runtime}</td>
                        <td>${show.genres_list}</td>
                        <td>${show.rating}</td>
                        <td>${show.trailer !== null ? `<a href=${show.trailer}>${show.trailer}</a>` : `No URL found in DB`}</td>
                        <td>${show.homepage !== null ? `<a href=${show.homepage}>${show.homepage}</a>` : `No URL found in DB`}</td>
                        <td class="action-column">
                        <button type="button" class="icon-button"><i class="fa fa-edit fa-fw"></i></button>
                        <button type="button" class="icon-button"><i class="fa fa-trash fa-fw"></i></button>
                    </td>
                    </tr>
                
            `;

        }

        const outerHtml = `
                <thead>
                <tr> 
                    <th id="table-header-title">Title ${indicator}</th>
                    <th id="year">Release year ${indicator}</th>
                    <th id="runtime">Runtime ${indicator}</th>
                    <th id="genres">Genres</th>
                    <th id="rating">Rating ${indicator}</th>
                    <th>Trailer</th>
                    <th>Homepage</th>
                    <th class="action-column">Action</th>
                </tr>
                </thead>
                <tbody class="text-center">
                ${showList}
                </tbody>
        `;

        let showsContainer = document.querySelector('#shows-container');
        showsContainer.insertAdjacentHTML("beforeend", outerHtml);

        let title = document.querySelector('#table-header-title')
        let year = document.querySelector('#year')
        let runtime = document.querySelector('#runtime')
        let rating = document.querySelector('#rating')

        title.addEventListener('click', () => {
            let order = 'title'
            dom.direction_switch(offset, order, direction)
        })
        year.addEventListener('click', () => {
            let order = 'year'
            dom.direction_switch(offset, order, direction)
        })
        runtime.addEventListener('click', () => {
            let order = 'runtime'
            dom.direction_switch(offset, order, direction)
        })
        rating.addEventListener('click', () => {
            let order = 'rating'
            dom.direction_switch(offset, order, direction)
        })
        let showTitles = document.querySelectorAll(".table-title")
        for (let showTitle of showTitles) {
            showTitle.addEventListener('click', () => {
                dataHandler.getShow(showTitle.id)
            })
        }

    },

    showShow: function (show) {
        document.title = show.title
        let header = document.querySelector('#page-header')
        header.innerText = 'Show details'
        const cards = document.querySelectorAll('.card')
        for (let card of cards) card.remove()
        dom.loadShowDetailsTemplate()
        dom.loadVideo(show)

        let showTitle = document.querySelector("#show-title")
        showTitle.innerHTML = show.title
        let showInfo = document.querySelector("#show-runtime-genre-year")
        showInfo.innerHTML = `${Math.floor(show.runtime / 60) === 0 ? '' : String(Math.floor(show.runtime / 60)) + 'h'} ${show.runtime % 60}min  
                <span class="separator">|</span>${show.genres_list} <span
                            class="separator">|</span> ${show.date}`
        let showOverview = document.querySelector("#overview")
        showOverview.innerHTML = show.overview
        let showRating = document.querySelector("#show-rating")
        showRating.innerHTML = `${show.rating} / 10`
        let showStars = document.querySelector("#show-stars")
        console.log(show)
        const actors = (show.actors_list).split(",")
        let actorsList = '';
        for (let actor of actors) {
            actorsList += `<a href="${actor}" >${actor}</a>`
        }
        let outerHTML = `
            <b>Stars: </b>${actorsList}
            `
        showStars.innerHTML = outerHTML

        dom.loadSeasons(show.id)

    },

    loadSeasons: function (show_id) {
        dataHandler.getSeasonsByShow(show_id)
    },

    showSeasons: function (seasons) {
        let seasonsList = ''

        for (let season of seasons) {

            seasonsList += `
            <tr>
                <td>${season.season_number}</td>
                <td>${season.title}</td>
                <td>${season.overview}</td>
            </tr>
            
            `
        }
        const outerHtml = `
            <table>
                <thead>
                <tr> 
                    <th id="table-season-number"></th>
                    <th id="table-season-title">Title</th>
                    <th id="table-season-title">Overview</th>
                </tr>
                </thead>
                <tbody>
                ${seasonsList}
                </tbody>
           </table>
        `;

        let seasonsContainer = document.querySelector('#seasons-list')
        seasonsContainer.insertAdjacentHTML("beforeend", outerHtml);
    },
    loadVideo: function (show) {
        let videoId = (show.trailer).split('v=')[1]
        let YTplayer = document.querySelector('#player')
        const newTrailerUrl = `https://www.youtube.com/embed/${videoId}`
        let iframe = `<iframe class="poster col col-third" width="560" height="315" src="${newTrailerUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
        YTplayer.innerHTML = iframe
    },

    direction_switch: function (offset, order, direction) {
        let showsContainer = document.querySelector('#shows-container');
        showsContainer.innerHTML = ''
        direction === 'ASC' ? direction = 'DESC' : direction = 'ASC'
        dataHandler.getMostRatedShows(offset, order, direction)
    },

    showPagination: function (showsOnPage, maxShowsCount, offset, order, direction) {
        const numberOfPages = Math.ceil(maxShowsCount / showsOnPage)
        let pageList = ''
        let i
        for (i = 1; i <= numberOfPages; i++) {
            offset = (i - 1) * showsOnPage
            pageList += `<a class="page-number" id="${offset}">${i} </a>`
        }

        let pages = document.querySelector('.pagination')
        pages.insertAdjacentHTML("beforeend", pageList);

        let pageNumbers = document.querySelectorAll('.page-number')
        for (let pageNumber of pageNumbers) {
            pageNumber.addEventListener('click', () => dom.showAnotherPage(pageNumber.id, order, direction))
        }
    },

    showAnotherPage: function (offset, order, direction) {
        let showsContainer = document.querySelector('#shows-container');
        showsContainer.innerHTML = ''
        dataHandler.getMostRatedShows(offset, order, direction)
    },






























    loadShowDetailsTemplate: async function () {
        let contentContainer = document.querySelector('#content');
        let detailedViewTemp = document.querySelector('#detailed-view');
        let detailedView = detailedViewTemp.content.cloneNode(true)
        contentContainer.appendChild(detailedView)
    },

}