// const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const characters = 'abcdefghijklmnopqrstuvwxyz'
// const characters = '1234567890'
let iteration
let lineCont
const Delay = X => new Promise((resolve, reject) => { setTimeout(resolve, X) })

const startup = () => {
    lineCont = document.getElementById('line-cont')
    createLines()
    document.querySelectorAll('.glitchtexteffect').forEach((element) => {
        element.onmouseover = e => {
            iteration = 0
            effect(e.target)
            linesMove(e.target)
        }
        element.onfocus = e => {
            iteration = 0
            effect(e.target)
            linesMove(e.target)
        }
        element.onmouseleave = e => {
            resetlines()
        }
        

    })
    window.onresize = () => createLines()
}



const effect = async (e) => {
    let lettersPerPlace = 3 //how many letters will show up before the correct letter
    let time = 33 //ms
    const valueTarget = e.attributes.value.value
    e.innerText =
        e.innerText.split("")
            .map((x, index) => {
                if (index < iteration) { return valueTarget[index] }
                return characters[Math.floor(Math.random() * characters.length)]
            })
            .join("");
    if (iteration < valueTarget.length) {
        iteration += 1 / lettersPerPlace;
        await Delay(easeOut((iteration) / valueTarget.length) * time)
        effect(e)
    }
}
let width
let height
let columns
let rows
let horizonatalArr 
let verticalArr
const createLines = () => {
    horizonatalArr = []
    verticalArr = []
    lineCont.innerHTML = ""
    width = document.body.clientWidth
    height = document.body.clientHeight
    const size = 300
    columns = Math.floor(width / size);
    rows = Math.floor(height / size);
    for (var i = 0; i < columns+2; i++) {

        const newpos = (width / (columns + 1)) * i
        const line = document.createElement('div')
        line.classList.add('line', 'vertical')
        line.style.left = newpos - 1  + 'px'
        lineCont.appendChild(line)

        verticalArr.push({line, ogPos: newpos})
    }
    for (var i = 0; i < rows+2; i++) {
        
        const newpos = (height / (rows + 1)) * i
        const line = document.createElement('div')
        line.classList.add('line', 'horizontal')
        line.style.top = newpos - 1 + 'px'
        lineCont.appendChild(line)

        horizonatalArr.push({line, ogPos: newpos})
    }
}

const linesMove = async (element) => {
    const pos = element.getBoundingClientRect()
    verticalArr.forEach(obj => {
        const rect = obj.line.getBoundingClientRect();
        obj.distance = rect.left - pos.left
    });
    horizonatalArr.forEach(obj => { 
        const rect = obj.line.getBoundingClientRect();
        obj.distance = rect.top - pos.top
    });
    const topH = greatest(horizonatalArr.filter(x=>x.distance < 0)).line
    const bottomH = lowest(horizonatalArr.filter(x=>x.distance > 0)).line
    
    const leftV = greatest(verticalArr.filter(x=>x.distance < 0)).line
    const rightV = lowest(verticalArr.filter(x=>x.distance > 0)).line
    await Delay(100)
    leftV.style.left = pos.left + "px"
    rightV.style.left = pos.right + "px"
    topH.style.top = pos.top + "px"
    bottomH.style.top = pos.bottom + "px"
}

const resetlines = () => {
    verticalArr.forEach(obj => {
        obj.line.style.left = obj.ogPos + 'px'
    })
    horizonatalArr.forEach(obj => {
        obj.line.style.top = obj.ogPos + 'px'
    })
}

const lowest = arr => arr.reduce((acc, loc) => acc.distance < loc.distance ? acc : loc)
const greatest = arr => arr.reduce((acc, loc) => acc.distance > loc.distance ? acc : loc)

const easeOut = (x) => 1 - (1 - x) * (1 - x)

// const startup = () => {
//     text = document.getElementById('text')
//     let interval
//     text.onmouseover = (e) => {
//         const valueTarget = e.target.attributes.value.value
//         let iteration = 0
//         // for(var i = 0; i < valueTarget.length; i++){
//         interval = setInterval(() => {
//             e.target.innerText =
//             e.target.innerText.split("")
//             .map((x, index) => {
//                 if (index < iteration){return valueTarget[index]}
//                 return alphabet[Math.floor(Math.random()*alphabet.length)]})
//             .join("");
//             if(iteration >= valueTarget.length){
//                 clearInterval(interval)
//             }
//             iteration += 1/3;
//         }, 50)
//         iteration = 0
//     }
// }