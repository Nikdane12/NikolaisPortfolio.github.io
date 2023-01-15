let diecont
let numberarray = []
let diearray = ['⚀','⚁','⚂','⚃','⚄','⚅']
const allEqual = arr => arr.every(val => val === arr[0]);
let ganger

const startup = () => {
    diecont = document.getElementById('die-cont')
    ganger = document.getElementById('ganger')
    roll()
}

const generatespots = () => {
    for(var i = 0; i < ganger.value; ++i){
        let diespot = document.createElement('div')
        let dietext = document.createTextNode(`${numberarray[i]}`)
        diespot.appendChild(dietext)
        diespot.classList.add('diespot')
        diecont.appendChild(diespot)
    }
}

const roll = () =>{
    generatespots()
    numberarray = []
    for(var i = 0; i < ganger.value; ++i){
        // let randomthing = 1
        let randomthing = Math.floor(Math.random()*6)
        numberarray.push(diearray[randomthing])
    }
    while (diecont.hasChildNodes()) {
        diecont.removeChild(diecont.firstChild)
    }
    generatespots()
    if(allEqual(numberarray)){
        startConfetti()
        setTimeout(() => {stopConfetti()}, 2000)
    }
}