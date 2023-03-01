const networks = require('./networks')
const express = require('express')
const { default: axios } = require('axios')
// const axios = require('axios')
const config = require('./config')
const portfolio = config.getApp('portfolio')
const port = portfolio.port
let hostname = networks.wifi?.address

if (typeof hostname === 'undefined') {
    console.log('WARNING: WiFi network address not found, using localhost')
    hostname = 'localhost'
}

const app = express()

app.use(express.static('public'))

/* CORS */
app.options("/*", function (req, res, next) {
    res.set('access-control-allow-origin', '*')
    res.set('access-control-allow-methods', 'GET,POST,OPTIONS')
    res.set('access-control-allow-headers', 'Authorization, Content-Length, Content-Type') //Content-Type because "safe listed" only counts for application/x-www-form-urlencoded, multipart/form-data, or text/plain
    res.send(200)
});


// app.get('/', (req, res) => {
//     // res.send('Hello World!')
//     res.sendFile('./Main.html')
// })


const continueWatching = [
    'tt4574334',
    'tt3896198',
    'tt0068646',
    'tt0468569',
    'tt0110912',
    'tt1375666',
    'tt0133093',
    'tt0076759',
    'tt1630029',
]

const popular = [
    'tt11198330',
    'tt13207736',
    'tt12593682',
    'tt15318872',
    'tt9253284',
    'tt0903747',
    'tt8291284',
    'tt6710474',
    'tt14452776',
    'tt1877830',
    'tt4574334',
    'tt7286456',
]

const newtonotflix = [
    'tt7631058',
    'tt11502498',
    'tt7131622',
    'tt1853728',
    'tt6751668',
    'tt1825683',
    'tt3501632',
    'tt0361748',
    'tt1751634',
    'tt10954984',
]


const getFilms = async (imdbIds, addProgress) => {
    let headers = {
        'Accept': 'application/json',
        'Accept-Encoding': 'identity'
    }

    const films = []

    for (var id of imdbIds) {
        let response
        try {
            response = await axios.get(`https://www.omdbapi.com/?i=${id}&apikey=99ec1739`, {headers})

        } catch (error) {
            console.log(error);
        }
        
        var filmProgress

        if (addProgress) {
            filmProgress = randomprogress()
        }
        else {
            filmProgress = 0
        }

        const d = response.data

        

        const film = {
            title: d.Title,
            img: d.Poster,
            year: d.Year,
            imdbid: d.imdbID,
            desc: d.Plot,
            time: d.Runtime,
            director: d.Director,
            actors: d.Actors,
            genre: d.Genre,
            progress: filmProgress,

        }

        films.push(film)

    }

    return films
}

const randomprogress = () => Math.random() * 80 + 10

let filmList

const PreloadFilmList = async () => {
    let filmList
    filmList = [
        {
            id: 0,
            categoryName: "Continue Watching",
            films: await getFilms(continueWatching, true),

        },
        {
            id: 1,
            categoryName: "Popular",
            films: await getFilms(popular, false),
        },
        {
            id: 2,
            categoryName: "New to Notflix",
            films: await getFilms(newtonotflix, false),
        },

    ]
    return filmList
}

app.get('/getpics', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.json(filmList)
})

const server = app.listen(port, hostname)

const sayHello = async () => {
    console.log(`${portfolio.name} listening on ${hostname}:${port}, Pid: ${process.pid}`)
    filmList = await PreloadFilmList()
}

server.on('listening', sayHello)

app.get('/getpics', (req, res) => {

    const fruit = [
        {
            title: 'apple',
            img: 'https://cdn.vox-cdn.com/thumbor/pjeFz7BdE9yMiVVnbdC_JONwc48=/1400x788/filters:format(png)/cdn.vox-cdn.com/uploads/chorus_asset/file/9518377/Screen_Shot_2017_10_23_at_10.16.32_AM.png',
            url: '',
            desc: ''
        },
        {
            title: 'orange',
            img: 'https://strategiesforparents.com/wp-content/uploads/adam-niescioruk-ltn8ztC6kjk-unsplash-720x720.jpg',
            url: '',
            desc: ''
        },
        {
            title: 'pear',
            img: 'https://media1.fdncms.com/inlander/imager/pick-a-pear/u/zoom/2362696/checkin1-1.jpg?cb=1469660725',
            url: '',
            desc: ''
        }
    ]

    res.setHeader('Access-Control-Allow-Origin', '*')

    res.json(fruit)
    // res.send(JSON.stringify(fruit))
})

