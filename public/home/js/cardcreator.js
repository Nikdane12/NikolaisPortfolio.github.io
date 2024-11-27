const HTMLprojects = { 
    title: 'HTML Projects', 
    group: 'HTMLprojects',
    cards: [
        { name: 'Gulbolle Party Game', image: '', link: 'gulbolle', datecreated: '29.01.24', tags: ['JS'],},
        { name: 'Character Creator', image: 'viking_scene_cycles_Small.png', link: 'charactercreator', datecreated: '21.02.23', tags: ['JS', 'LIBRARY'],},
        { name: 'Chess App', image: 'ChessThumbnail.png', link: 'chessjs', datecreated: '07.02.23', tags: ['JS', 'LIBRARY'],},
        { name: 'Julekalander', image: 'JulekalanderThumbnail.png', link: 'julekalander', datecreated: '06.12.22', tags: ['JS', 'SCHOOL'],},
        { name: 'Weather App', image: 'WeatherAppThumbnail.png', link: 'weather', datecreated: '29.11.22', tags: ['JS', 'API'],},
        { name: 'Product Site', image: 'ProductSiteThumbnail.png', link: 'productsite', datecreated: '26.11.22', tags: ['JS']},
        { name: 'Notflix', image: 'NotflixThumbnail.png', link: 'notflix', datecreated: '04.11.22', tags: ['JS', 'API'],},
        { name: 'Kino Site', image: 'KinoThumbnail.png', link: 'kinoprojekt/kinohome', datecreated: '20.10.22', tags: ['HTML', 'CSS', 'SCHOOL'],},
    ]
}


const HTMLexamples = { 
    title: 'HTML Examples', 
    group: 'HTMLexamples',
    cards: [
        { name: 'Design Examples', image: 'DesignTest.png', link: 'designtest', datecreated: '02.05.23', tags: ['CSS', 'EXAMPLE']},
        { name: 'Interactive Cube', image: 'Cubestuff.png', link: 'cubeThreeJs', datecreated: '13.03.23', tags: ['JS', 'TEST', 'LIBRARY']},
        { name: 'Three.js Shaders', image: 'fox.png', link: 'threeJS2', datecreated: '06.03.23', tags: ['JS', 'TEST', 'LIBRARY']},
        { name: 'Three.js', image: 'threejsapp.png', link: 'threeJS', datecreated: '04.03.23', tags: ['JS', 'TEST', 'LIBRARY']},
        { name: 'Text Effect', image: 'TextEffect.png', link: 'texteffect', datecreated: '21.02.23', tags: ['JS', 'EXAMPLE']},
        { name: 'Blocks', image: 'blocks.png', link: 'blocks', datecreated: '01.02.23', tags: ['JS', 'TEST'],},
        { name: 'Carousel', image: 'Carousel.png', link: 'carousel', datecreated: '27.01.23', tags: ['JS', 'TEST'],},
        { name: 'Array Oppgave', image: 'Array_Oppgave.png', link: 'arrayoppgave', datecreated: '24.01.23', tags: ['JS', 'SCHOOL'],},
        { name: 'Animation Test', image: 'animationtest.png', link: 'animationtest', datecreated: '19.01.23', tags: ['JS', 'LIBRARY'],},
        { name: 'Quiz', image: 'quiz.png', link: 'quiz', datecreated: '10.01.23', tags: ['JS', 'SCHOOL'],},
        { name: 'Sparing', image: 'Sparing.png', link: 'sparing', datecreated: '20.12.22', tags: ['JS', 'LIBRARY', 'SCHOOL'],},
        { name: 'Kalkulator', image: 'kalkulator.png', link: 'kalkulator', datecreated: '15.01.23', tags: ['JS', 'LIBRARY', 'SCHOOL'],},
        { name: 'Radial Array', image: 'RadialArray.png', link: 'radialarray', datecreated: '25.11.22', tags: ['JS', 'EXAMPLE'],},
        { name: 'Example Parrallax', image: 'Practice1.png', link: 'exampleparallax', datecreated: '25.11.22', tags: ['JS', 'EXAMPLE'],},
    ]
}

let body = document.getElementById('mainbodyforcards')
const createCards = (cardgroup) => {
    const title = document.createElement('div')
    title.classList.add('title')
    title.innerText = cardgroup.title
    body.appendChild(title)

    const cardcont = document.createElement('div')
    cardcont.classList.add('card-cont')
    cardcont.setAttribute('id', 'card-cont')
    body.appendChild(cardcont)

    cardgroup.cards.forEach(element => {
        const card = document.createElement('div')
        card.classList.add('card')
        const link = document.createElement('a')
        link.setAttribute('href', '/' + cardgroup.group + '/' + element.link + '.html')
        // link.setAttribute('target', '_blank')
        const image = document.createElement('img')
        image.classList.add('cardimg')
        image.setAttribute('src', '/home/img/' + element.image)
        const tagsCont = document.createElement('div')
        tagsCont.classList.add('tags-cont')
        const cardtitle = document.createElement('div')
        cardtitle.classList.add('cardtitle')
        cardtitle.appendChild(document.createTextNode(element.name))
        const carddate = document.createElement('div')
        carddate.classList.add('carddate')
        carddate.appendChild(document.createTextNode(element.datecreated))
        element.tags.forEach(x => {
            const tag = document.createElement('div')
            tag.classList.add('tag')
            let svg
            switch(x){
                case 'JS':
                case 'HTML':
                case 'CSS':
                    svg = document.createElement('img')
                    svg.setAttribute('onload', 'SVGInject(this,{makeIdsUnique:false,useCache:false})')
                    tag.appendChild(svg)
                    switch(x){
                        case 'JS':
                            svg.setAttribute('src', '/home/img/logo-javascript.svg')
                            break
                        case 'HTML':
                            svg.setAttribute('src', '/home/img/logo-html5.svg')
                            break
                        case 'CSS':
                            svg.setAttribute('src', '/home/img/logo-css3.svg')
                            break
                    }
                    break
                default:
                    tag.classList.add('tag-non')
                    tag.appendChild(document.createTextNode(x))
            }
            tagsCont.appendChild(tag)
        });
        if(element.class){
            element.class.forEach(x => {
                card.classList.add(x)
            })
        }
        link.appendChild(image)
        card.appendChild(link)
        card.appendChild(cardtitle)
        card.appendChild(tagsCont)
        card.appendChild(carddate)
        cardcont.appendChild(card)
    });
}