// const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const characters = 'abcdefghijklmnopqrstuvwxyz'
// const characters = '1234567890'
let iteration
let lineCont

let sound
, canvas
, ctx

const Delay = X => new Promise((resolve, reject) => { setTimeout(resolve, X) })

const startup = () => {
    document.querySelectorAll('.texteffect').forEach(element => {
        const text = element.innerText
        element.addEventListener('mouseover', (e) => {
            iteration = 0
            glitchtexteffect(e.target, text, true)
        })
    })
    document.querySelectorAll('.texteffect2').forEach(element => {
        const text = element.innerText
        
        glitchtexteffect(element, text, false)
        const randomtext = element.innerText
        element.addEventListener('mouseover', (e) => {
            iteration = 0
            glitchtexteffect(e.target, text, true)

        })
        element.addEventListener('mouseleave', (e) => {
            iteration = text.length
            glitchtexteffectV2leave(e.target, randomtext, text)

        })
    })
    
    createLines()
    document.querySelectorAll('.lineeffect').forEach(element => {
        element.addEventListener('mouseover', (e) => {
            linesMove(e.target)
        })
        element.addEventListener('mouseleave', resetlines)
    })

    window.onresize = () => createLines()
    
    sound = document.getElementById('sound')
    canvas = document.getElementById("canvas")

    drawSineWave()
    sound.addEventListener('click', soundtoggle)
}

let v2start = true

const glitchtexteffect = async (e, text, delay) => {
    let lettersPerPlace = 3 //how many letters will show up before the correct letter
    let time = 33 //ms
    let valueTarget = text
    e.innerText =
        e.innerText.split("")
            .map((x, index) => {
                if (index < iteration) { return valueTarget[index] }
                return characters[Math.floor(Math.random() * characters.length)]
            })
            .join("");
    if (iteration < valueTarget.length) {
        iteration += 1 / lettersPerPlace;
        if(delay){await Delay(easeOut((iteration) / valueTarget.length) * time)}
        glitchtexteffect(e, text, true)
    }
}


const glitchtexteffectV2leave = async (e, text, OGtext) => {
    let lettersPerPlace = 3 //how many letters will show up before the correct letter
    let time = 33 //ms
    e.innerText =
    text.split("")
            .map((x, index) => {
                if (index < iteration) {return OGtext[index]}
                return text[index]
            })
            .join("");
    if (iteration > 1) {
        iteration += -(1 / lettersPerPlace);
        await Delay(easeOut((iteration) / text.length) * time)
        glitchtexteffectV2leave(e, text, OGtext)
    }
}

let horizonatalArr
, verticalArr

const createLines = () => {
    if(!lineCont){
        lineCont = document.createElement('div')
        lineCont.setAttribute('id', 'line-cont')
        document.body.appendChild(lineCont)
    }
    horizonatalArr = []
    verticalArr = []
    lineCont.innerHTML = ""
    let width = document.body.clientWidth
    let height = document.body.clientHeight
    const size = 300
    let columns = Math.floor(width / size);
    let rows = Math.floor(height / size);
    for (var i = 0; i < columns + 2; i++) {
        const newpos = (width / (columns + 1)) * i
        const line = document.createElement('div')
        line.classList.add('line', 'vertical')
        line.style.left = newpos - 1 + 'px'
        lineCont.appendChild(line)

        verticalArr.push({ line, ogPos: newpos })
    }
    for (var i = 0; i < rows + 2; i++) {
        const newpos = (height / (rows + 1)) * i
        const line = document.createElement('div')
        line.classList.add('line', 'horizontal')
        line.style.top = newpos - 1 + 'px'
        lineCont.appendChild(line)

        horizonatalArr.push({ line, ogPos: newpos })
    }
}

const linesMove = async (element) => {
    await Delay(100)
    const pos = element.getBoundingClientRect()
    verticalArr.forEach(obj => {
        const rect = obj.line.getBoundingClientRect();
        obj.distance = rect.left - pos.left
    });
    horizonatalArr.forEach(obj => {
        const rect = obj.line.getBoundingClientRect();
        obj.distance = rect.top - pos.top
    });
    const topH = greatest(horizonatalArr.filter(x => x.distance < 0)).line
    const bottomH = lowest(horizonatalArr.filter(x => x.distance > 0)).line

    const leftV = greatest(verticalArr.filter(x => x.distance < 0)).line
    const rightV = lowest(verticalArr.filter(x => x.distance > 0)).line
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

let amplitude = 40
    , frequency = 0.1
    , phaseShift = 0
    , scaleX = 1
    , scaleY = 1
    , lineWidth = 3
    , yOffset
    , speed = 0.06
    , targetAmplitude = 40
    , easingFactor = 0.1

const drawSineWave = () => {
    
    ctx = canvas.getContext("2d");
    yOffset = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
        const distanceFromMinX = Math.abs(x - 0);
        const distanceFromMaxX = Math.abs(x - canvas.width);

        const amplitudeAtX = amplitude * Math.min(distanceFromMinX, distanceFromMaxX) / canvas.width;

        const y = amplitudeAtX * Math.sin(frequency * x + phaseShift) + yOffset;
        const scaledX = x * scaleX;
        const scaledY = y * scaleY;
        if (x == 0) {
            ctx.moveTo(scaledX, scaledY);
        } else {
            ctx.lineTo(scaledX, scaledY);
        }
    }
    ctx.stroke();
    phaseShift += speed;
    amplitude += (targetAmplitude  - amplitude) * easingFactor
    requestAnimationFrame(drawSineWave);
}

const soundtoggle = () => {
    targetAmplitude = targetAmplitude == 40 ? 10 : 40;
}