
let filmPics

const main = async () => {

    const slkdncfilmPics = await axios.get('http://10.144.32.198:88/getpics')
    filmPics = slkdncfilmPics.data
    const mainbody = document.getElementById('mainbody')

    for (var filmset of filmPics) {

        const catcont = document.createElement('div')
        catcont.classList.add('catcont')
        catcont.innerHTML = `
            <div class="cattitle">${filmset.categoryName}</div>
            <button class="prev" >❮</button>
            <button class="next" >❯</button>`

        mainbody.appendChild(catcont)

        const filmcont = document.createElement('div')
        filmcont.classList.add('filmcont')
        catcont.appendChild(filmcont)

        for (var filmData of filmset.films) {

            const film = document.createElement('div')
            film.classList.add('film')
            film.innerHTML = `
            <a href="javascript:void(0)" class="filmbtn" onclick="openModal(${filmset.id},'${filmData.imdbid}')" >
                <div class="imagecont">
                    <img src="${filmData.img}" />
                    <div class="progressbar" style="width:${filmData.progress}%"></div>
                </div>
            </a>`
            filmcont.appendChild(film)

            // const aTag = film.getElementsByClassName('filmbtn')[0]
            // aTag.addEventListener('click', () => openModal(filmset.id , filmData.imdbid));

        }

        new filmMover(catcont)

        search()
    }

}

const openModal = (filmListId, imdbId) => {

    const slktyvnl = filmPics.find(x => {
        // is this the right x?? if so return true if not return false
        if (x.id == filmListId) { return true }
        else { return false }

    })

    const filmData = slktyvnl.films.find(x => {
        if (x.imdbid == imdbId) { return true }
        else { return false }
    })



    const modal = document.getElementById('modal')
    modal.innerHTML = `<div class="modal-content" id="modal-content">
    <div class="modalclose" id="modalclose">&times;</div>
    <img class="modalimg" src="${filmData.img}"></img>
    <div class="modaltitle">${filmData.title}</div>
    <div class="modaldesc">${filmData.desc}</div>
    <div class="modalstats">
        <div class="stats1">
            Year: <br>
            Runtime: <br>
            Director: <br>
            Actors: <br>
        </div>
        <div class="stats2">
            ${filmData.year}<br>
            ${filmData.time}<br>
            ${filmData.director}<br>
            ${filmData.actors}<br>
        </div>
    </div>
    <a class="filmlink" href="https://www.imdb.com/title/${filmData.imdbid}" target=”_blank”>IMDB</a>
    </div>`

    const closeBtn = document.getElementById('modalclose')
    closeBtn.addEventListener('click', (e) => closeModal(e))

    const modalcontent = document.getElementById('modal-content')
    modalcontent.addEventListener('click', e => e.cancelBubble = true)

}

const closeModal = () => {
    const modal = document.getElementById('modal')
    modal.innerHTML = ``
}

const openSearchModal = (x) => {

    const modal = document.getElementById('modal')
    modal.innerHTML = `<div class="modal-content" id="modal-content">
    <div class="modalclose" id="modalclose">&times;</div>
    <img class="modalimg" src="${x.Poster}"></img>
    <div class="modaltitle">${x.Title}</div>
    <div class="modaldesc">${x.Plot}</div>
    <div class="modalstats">
        <div class="stats1">
            Year: <br>
            Runtime: <br>
            Director: <br>
            Actors: <br>
        </div>
        <div class="stats2">
            ${x.Year}<br>
            ${x.Runtime}<br>
            ${x.Director}<br>
            ${x.Actors}<br>
        </div>
    </div>
    <a class="filmlink" href="https://www.imdb.com/title/${x.imdbID}" target=”_blank”>IMDB</a>
    </div>`

    const closeBtn = document.getElementById('modalclose')
    closeBtn.addEventListener('click', (e) => closeModal(e))

    const modalcontent = document.getElementById('modal-content')
    modalcontent.addEventListener('click', e => e.cancelBubble = true)
}

const openErrorModal = () => {
    const modal = document.getElementById('modal')
    modal.innerHTML = `<div class="modal-content" id="modal-content">
    <div class="modalclose" id="modalclose">&times;</div>
    <div class="modaltitle">Film not found</div>`
}

const search = () => {
    const searchbox = document.getElementById('searchbox')
    searchbox.addEventListener ("keypress", async (event) => {
        if (event.key === "Enter") {
            let searchoutput = searchbox.value
            let response = await axios.get(`http://www.omdbapi.com/?t=${searchoutput}&apikey=99ec1739`)
            if (response.data.Response == 'False'){
                openErrorModal()
            }
            else{
            openSearchModal(response.data)
            }
            searchbox.value = null
        }
    })

}



const screenWidth = () => {
    return document.body.offsetWidth;
}
const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}

class filmMover {

    prev
    next
    filmcont
    filmSize
    pos
    allFilms
    progress
    random

    constructor(x, pos = 0) {
        this.pos = pos

        const films = x.getElementsByClassName('film')

        this.prev = x.getElementsByClassName('prev')[0]
        this.prev.onclick = () => this.moveFilms(-1)
        this.next = x.getElementsByClassName('next')[0]
        this.next.onclick = () => this.moveFilms(1)

        this.filmcont = x.getElementsByClassName('filmcont')[0]
        this.filmSize = (films[0].offsetWidth + 10)
        this.allFilms = films.length

        this.updateLayout()

    }

    filmCount = () => {
        return Math.floor(screenWidth() / this.filmSize)
    }

    maxPos = () => {
        return this.allFilms / this.filmCount() -1
    }


    moveFilms = (n) => {

        this.pos += n


        if (this.pos <= 0) {
            this.pos = 0
        }
        this.updateLayout()
    }

    updateLayout = () => {

        if (this.pos == 0) {
            this.prev.style.display = "none"
        }
        else {
            this.prev.style.display = "inline"
        }
        if (this.pos > this.maxPos()) {
            this.next.style.display = "none";
            this.pos = this.maxPos()
        }
        else {
            this.next.style.display = "inline";
        }
        
        const filmCalc = this.pos * (-this.filmSize) * this.filmCount()
        this.filmcont.style.transform = `translatex(${filmCalc}px)`
    }


}
