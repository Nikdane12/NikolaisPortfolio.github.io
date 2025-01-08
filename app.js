const networks = require('./networks')
const express = require('express')
const { default: axios } = require('axios')
// const axios = require('axios')
const config = require('./config')
const portfolio = config.getApp('portfolio')
const port = portfolio.port

let hostname = networks.wifi?.address
// let hostname = "129.242.77.162" //eduroam
// let hostname = "129.242.249.82" //eduroam Campus

// let hostname = "10.239.253.238" //uitgjest

if (typeof hostname === 'undefined') {
    console.log('WARNING: WiFi network address not found, using localhost')
    hostname = 'localhost'
}


const fs = require('fs');


const app = express()
// const urlpath = "/home/img/GraphicsDesign/MyGrandmas.webm"
// const publicfilepath = "./public" + urlpath

// app.use(urlpath, async (req, res) => {
//     // res.sendFile('./home/img/GraphicsDesign/LilRobotVideo.webm', {headers: {"Content-Type": "video/webm", "Content-Length" : stat.size}})
//     var stat = fs.statSync(publicfilepath)
//     res.writeHead(200, {"Content-Type": "video/webm", "Content-Length" : stat.size});
//     var readStream = fs.createReadStream(publicfilepath);
//     readStream.pipe(res)
// })
    
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


const server = app.listen(port, hostname)

const sayHello = async () => {
    console.log(`${portfolio.name} listening on ${hostname}:${port}, Pid: ${process.pid}`)
    // filmList = await PreloadFilmList()
}

server.on('listening', sayHello)




// _______________________________________________
// GUL BOLLE STUFF

// const gameRooms = {};

// const createGameRoom = (roomId) => {
//     gameRooms[roomId] = {
//         teams: [],
//         wordBank: [],
//         usedWords: [],
//         currentTeamIndex: 0,
//         currentMode: 0,
//     };
// };

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'gulbolle.html'));
// });

// app.post('/create-room', (req, res) => {
//     const roomId = Date.now();
//     createGameRoom(roomId);
//     res.json({ roomId });
// });

// app.get('/play/:roomId', (req, res) => {
//     const { roomId } = req.params;

//     if (!gameRooms[roomId]) {
//         return res.status(404).send('Game room not found');
//     }

//     res.json(gameRooms[roomId]);
// });