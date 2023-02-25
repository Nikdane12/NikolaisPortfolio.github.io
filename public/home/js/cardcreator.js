const HTMLprojects = { 
    title: 'HTML Projects', 
    group: 'HTMLprojects',
    cards: [
        { name: 'Notflix', image: 'NotflixThumbnail.png', link: 'notflix',},
        { name: 'Weather App', image: 'WeatherAppThumbnail.png', link: 'weather',},
        { name: 'Julekalander', image: 'JulekalanderThumbnail.png', link: 'julekalander',},
        { name: 'Product Site', image: 'ProductSiteThumbnail.png', link: 'productsite',},
        { name: 'Kino Site', image: 'KinoThumbnail.png', link: 'kinoprojekt/kinohome',},
        { name: 'Chess App', image: 'ChessThumbnail.png', link: 'chessjs',},
    ]
}


const HTMLexamples = { 
    title: 'HTML Examples', 
    group: 'HTMLexamples',
    cards: [
        { name: 'Example Parralax', image: 'Practice1.png', link: 'exampleparallax',},
        { name: 'Radial Array', image: 'RadialArray.png', link: 'radialarray',},
        { name: 'Kalkulator', image: 'kalkulator.png', link: 'kalkulator',},
        { name: 'Sparing', image: 'Sparing.png', link: 'sparing',},
        { name: 'Quiz', image: 'quiz.png', link: 'quiz',},
        { name: 'Animation Test', image: 'animationtest.png', link: 'animationtest',},
        { name: 'Array Oppgave', image: 'Array_Oppgave.png', link: 'arrayoppgave',},
        { name: 'Carousel', image: 'Carousel.png', link: 'carousel',},
        { name: 'Blocks', image: 'blocks.png', link: 'blocks',},
        { name: 'Text Effect', image: 'TextEffect.png', link: 'texteffect',},
    ]
}

let mainbodyforcards = document.getElementById('mainbodyforcards')
const createCards = (cardgroup) => {
    const title = document.createElement('div')
    title.classList.add('title')
    title.innerText = cardgroup.title
    mainbodyforcards.appendChild(title)

    const cardcont = document.createElement('div')
    cardcont.classList.add('card-cont')
    cardcont.setAttribute('id', 'card-cont')
    mainbodyforcards.appendChild(cardcont)

    cardgroup.cards.forEach(element => {
        const card = document.createElement('div')
        card.classList.add('card')
        const link = document.createElement('a')
        link.setAttribute('href', '/' + cardgroup.group + '/' + element.link + '.html')
        link.setAttribute('target', '_blank')
        const image = document.createElement('img')
        image.classList.add('cardimg')
        image.setAttribute('src', 'home/img/' + element.image)
        link.appendChild(image)
        card.appendChild(link)
        cardcont.appendChild(card)
    });
}