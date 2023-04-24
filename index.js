import Movie from './Movie.js'
import Watchlist from './Watchlist.js'

const searchValue = document.getElementById("search-area")
const myWatchlistBtn = document.getElementById("watchlist-btn")

const start = document.getElementById("start-exploring")

document.addEventListener("submit", function(){
    start.innerHTML = ""
    fetch(`http://www.omdbapi.com/?&apikey=9d1b3c0c&s=${searchValue.value}`)
        .then((response)=>response.json())
        .then((data)=>{

        if (data.Response === 'False'){
            getNoDataPage()
        }
        else{
            getMovies(data.Search)
        }
    })
})

myWatchlistBtn.addEventListener("click", function(){
    renderWatchlistPage()
    })  


function getMovies(movieList){
    start.style.margin = `2em`
    for (let movie in movieList){
        fetch(`http://www.omdbapi.com/?&apikey=9d1b3c0c&i=${movieList[movie].imdbID}`)
        .then((response)=>response.json())
        .then((data)=> {

            // some poster links aren't found, there needs to be error prevention for that 

            let movieObject = new Movie(data)
           
            start.innerHTML += movieObject.getMovieHtml()

            // this is where the movies are pushed into the watchlist

            document.addEventListener("click", function(e){
    
                
            if (window.localStorage.length === 0 ){
                if (e.target.id === movieObject.imdbID){
                    window.localStorage.setItem(`${movieObject.imdbID}`, JSON.stringify(movieObject))
                    alert(`${movieObject.Title} is added to watchlist`)
                }
                 
            }
            else{ 
                // the already added or added alert comes more than 1 time because the loop goes over the movies 
                if (e.target.id === movieObject.imdbID){
                    if (window.localStorage.getItem(movieObject.imdbID)){
                        alert(`${movieObject.Title} is already added to watchlist`)

                    }

                    else{
                        window.localStorage.setItem(`${movieObject.imdbID}`, JSON.stringify(movieObject))
                        alert(`${movieObject.Title} is added to watchlist`)
                    }
                }
            }})
            
        })
    }
}

function getNoDataPage(){
    start.innerHTML = `
        <p class="start-exploring-text">Unable to find what you’re looking for. Please try another search.</p>
    `
}

function renderWatchlistPage(){
    start.style.margin = `2em`
    let watchlist = []

    for (let index in range(0, window.localStorage.length - 1)){
        let watchlistMovie = JSON.parse(window.localStorage.getItem(`${window.localStorage.key(index)}`))
        watchlist.push(watchlistMovie)

    }

    let watchlistObject = new Watchlist(watchlist)
    watchlistObject.getWatchlistHtml()

    document.addEventListener('click', function(e){
        for (let movie in watchlist){
            if(e.target.id === `remove-${watchlist[movie].imdbID}`){
                var result = confirm(`Are you sure you want to remove ${watchlist[movie].Title} from your watchlist?`);
                if (result) {
                    watchlistObject.removeFromWatchlist(watchlist[movie].imdbID)
                }

            }
        }
    })

}

function range(start, end) {
    let ans = []
    for (let i = start; i <= end; i++) {
        ans.push(i)
    }
    return ans
}