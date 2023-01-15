const main = () => {
    const cont = document.getElementById('cont')
cont.style.transform = `rotate(-90deg)`
const colorOutput = document.getElementsByClassName("coloroutput")

const white = document.getElementById("white")
const grey = document.getElementById("grey")
const purple = document.getElementById("purple")
const imgs = [
    'https://images.samsung.com/is/image/samsung/p6pim/no/2208/gallery/no-galaxy-buds2-pro-r510-sm-r510nzaaeub-533207653?$1300_1038_PNG$',
    'https://images.samsung.com/is/image/samsung/p6pim/no/2208/gallery/no-galaxy-buds2-pro-r510-sm-r510nzwaeub-533207673?$1300_1038_PNG$',
    'https://images.samsung.com/is/image/samsung/p6pim/no/2208/gallery/no-galaxy-buds2-pro-r510-sm-r510nlvaeub-533207635?$1300_1038_PNG$',
]

let defaul = imgs.length
let pos = 0

const updateCircle = () => {
    const rotater = pos * 360 / cont.childElementCount
    cont.style.transform = `rotate(${rotater - 90}deg)`
}

grey.onclick = () => {
    pos = 0
    updateCircle()
    setColorOutput(`Graphite`)
}

purple.onclick = () => {
    pos = 1
    updateCircle()
    setColorOutput(`Bora Purple`)

}
white.onclick = () => {
    pos = 2
    updateCircle()
    setColorOutput(`White`)
    

}

const makeObjs = (x) => {
    let rotator = 360 / x
    for (var i = 0; i < x; ++i) {
        const obj = document.createElement('div')
        obj.classList.add('obj')
        const number = document.createTextNode(`${i}`)
        obj.appendChild(number)
        obj.innerHTML = `<img src="${imgs[i]}"/>`
        cont.appendChild(obj)
        obj.style.transform = `rotate(${i * rotator}deg) translatey(${-0.5 * cont.offsetWidth + obj.offsetWidth * 0.5 - 350}px)`
    }

}

const setColorOutput = (x) => {  
    for (var i = 0; i < colorOutput.length; ++i) {
        var currentColor = x
        colorOutput[i].innerHTML = x
    }

}

makeObjs(defaul)
setColorOutput(`Graphite`)


}