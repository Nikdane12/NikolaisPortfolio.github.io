let blockcont = document.getElementById('blockcont')
let pieceholder = document.getElementById('pieceholder')
let dotholder = document.getElementById('dotholder')
let selected = false
const chess = new Chess()



const createTiles = () => {
    for (let i = 0; i < 64; i++) {
        const singleblock = document.createElement("div")
        const newNumber = Math.floor(i / 8) + 1;
        const letter = String.fromCharCode(97 + i % 8);
        singleblock.classList.add("singleblock")
        singleblock.dataset.pos = letter + newNumber
        const square = chess.get(letter + newNumber) || 'empty'
        singleblock.dataset.piecetype = square.type || 'empty'
        singleblock.dataset.piececolor = square.color || 'empty'
        blockcont.appendChild(singleblock)
    }
    blockcont.style.setProperty("--columns", Math.sqrt(64))
}

createTiles()
console.log(chess.ascii());

const findPos = (element) => {
    const wrapperPosX = blockcont.getBoundingClientRect().left
    const positionX = element.getBoundingClientRect().left
    const distanceX = positionX + (element.clientWidth/2)
    const wrapperPosY = blockcont.getBoundingClientRect().top
    const positionY = element.getBoundingClientRect().top
    const distanceY = positionY + (element.clientHeight/2)
    return [distanceX, distanceY]
}

const setPos = (oldpos , newpos) => {
    const offsetX = (oldpos.clientWidth / 2)
    const offsetY = (oldpos.clientHeight / 2) 
    const [distanceX, distanceY] = findPos(newpos)
    oldpos.style.transform = `translate(${distanceX - offsetX}px, ${distanceY - offsetY}px)`
    // console.log(distanceX, -element.clientWidth, distanceY, -element.clientHeight);
    // element.style.top = distanceY - element.clientHeight + "px"
    // element.style.left = distanceX - element.clientWidth + "px"
}

const addPieces = () => {
    const gamePieces = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king']
    let injecter = `onload="SVGInject(this,{makeIdsUnique:false,useCache:false})"`
    const pawnscont = document.querySelectorAll('div[data-piecetype="p"]')
    pawnscont.forEach((element, index) => {
        pieceholder.innerHTML += `<div class="piece ${element.dataset.piecetype} ${element.dataset.piececolor == 'w' ? 'white' : 'black'}" data-piecepos="${pawnscont[index].dataset.pos}" ></div>`
        const piece = document.getElementsByClassName('p')[index]
        setPos(piece, element)
    })
    const knightcont = document.querySelectorAll('div[data-piecetype="n"]')
    knightcont.forEach((element, index) => {
        pieceholder.innerHTML += `<div class="piece ${element.dataset.piecetype} ${element.dataset.piececolor == 'w' ? 'white' : 'black'}" data-piecepos="${knightcont[index].dataset.pos}" ></div>`
        
        const piece = document.getElementsByClassName('n')[index]
        setPos(piece, element)

    })
    const bishopcont = document.querySelectorAll('div[data-piecetype="b"]')
    bishopcont.forEach((element, index) => {
        pieceholder.innerHTML += `<div class="piece ${element.dataset.piecetype} ${element.dataset.piececolor == 'w' ? 'white' : 'black'}" data-piecepos="${bishopcont[index].dataset.pos}" ></div>`
        
        const piece = document.getElementsByClassName('b')[index]
        setPos(piece, element)

    })
    const rookcont = document.querySelectorAll('div[data-piecetype="r"]')
    rookcont.forEach((element, index) => {
        pieceholder.innerHTML += `<div class="piece ${element.dataset.piecetype} ${element.dataset.piececolor == 'w' ? 'white' : 'black'}" data-piecepos="${rookcont[index].dataset.pos}" ></div>`
        
        const piece = document.getElementsByClassName('r')[index]
        setPos(piece, element)

    })
    const queencont = document.querySelectorAll('div[data-piecetype="q"]')
    queencont.forEach((element, index) => {
        pieceholder.innerHTML += `<div class="piece ${element.dataset.piecetype} ${element.dataset.piececolor == 'w' ? 'white' : 'black'}" data-piecepos="${queencont[index].dataset.pos}"  ></div>`
        
        const piece = document.getElementsByClassName('q')[index]
        setPos(piece, element)

    })
    const kingcont = document.querySelectorAll('div[data-piecetype="k"]')
    kingcont.forEach((element, index) => {
        pieceholder.innerHTML += `<div class="piece ${element.dataset.piecetype} ${element.dataset.piececolor == 'w' ? 'white' : 'black'}" data-piecepos="${kingcont[index].dataset.pos}" ></div>`
        
        const piece = document.getElementsByClassName('k')[index]
        setPos(piece, element)

    })

    
}
addPieces()

let selectedElement = null

const singleblocks = Array.from(document.getElementsByClassName('singleblock'))
singleblocks.forEach((element, index) => {
    element.onclick = () => {
        console.log('pos:', element.dataset.pos, 'type:', element.dataset.piecetype, 'color:', element.dataset.piececolor)
        console.log(ifArrayIsEmpty(chess.moves({ square: element.dataset.pos }), 'noMoves'))
        const piece = document.querySelectorAll(`[data-piecepos="${element.dataset.pos}"]`)[0]
        if (selectedElement) {
            deselect(selectedElement)
        }
        else{
            element.onclick = () => deselect(element)
        }
        if(!isundefined(piece)){piece.style.top = -10 + "px"}
        if(ifArrayIsEmpty(chess.moves({ square: element.dataset.pos }))){
            console.log('balls');
            chess.moves({ square: element.dataset.pos }).forEach((value, index) => {
                const div = document.createElement('div')
                div.classList.add('Gdotcont')
                const greendot = document.createElement('div')
                greendot.classList.add("greendot")
                div.appendChild(greendot)
                dotholder.appendChild(div)
                const avalibleMoves = chess.moves({ square: element.dataset.pos })
                let movesBlock = document.querySelectorAll(`div[data-pos="${avalibleMoves[index].slice(-2)}"]`)[0]
                setPos(div, movesBlock)
                movesBlock.onclick = () => {
                    movesBlock.removeEventListener('click', () => {})
                    movePiece(element.dataset.pos, avalibleMoves[index].slice(-2))
                    movesBlock = null
                }
    
    
            })
        }
        
        selectedElement = element;
    
    }}
)



// const select = (element) => {
//     console.log('pos:', element.dataset.pos, 'type:', element.dataset.piecetype, 'color:', element.dataset.piececolor)
//     console.log(ifArrayIsEmpty(chess.moves({ square: element.dataset.pos }), 'noMoves'))
//     const piece = document.querySelectorAll(`[data-piecepos="${element.dataset.pos}"]`)[0]
//     if (selectedElement) {
//         deselect(selectedElement)
//     }
//     else{
//         element.onclick = () => deselect(element)
//     }
//     if(!isundefined(piece)){piece.style.top = -10 + "px"}
//     if(ifArrayIsEmpty(chess.moves({ square: element.dataset.pos }))){
//         console.log('balls');
//         chess.moves({ square: element.dataset.pos }).forEach((value, index) => {
//             const div = document.createElement('div')
//             div.classList.add('Gdotcont')
//             const greendot = document.createElement('div')
//             greendot.classList.add("greendot")
//             div.appendChild(greendot)
//             dotholder.appendChild(div)
//             const avalibleMoves = chess.moves({ square: element.dataset.pos })
//             let movesBlock = document.querySelectorAll(`div[data-pos="${avalibleMoves[index].slice(-2)}"]`)[0]
//             setPos(div, movesBlock)
//             movesBlock.onclick = () => {
//                 movesBlock.removeEventListener('click', () => {})
//                 movePiece(element.dataset.pos, avalibleMoves[index].slice(-2))
//                 movesBlock = null
//             }


//         })
//     }
    
//     selectedElement = element;

// }

const movePiece = (from, to) => {
    selectedElement = null
    chess.move({ from: `${from}`, to: `${to}` })
    console.log('move:',from , to);
    const element = document.querySelectorAll(`[data-piecepos="${from}"]`)[0]
    console.log(element);
    // element.dataset.piecepos = to
    console.log(element);
    const squareElement = document.querySelectorAll(`[data-pos="${to}"]`)[0]
    setPos(element, squareElement)
    element.style.top = "0px"
    console.log('removed green');
    removeChilderen(dotholder)
}

const deselect = (element) => {
    console.log('deselect', element.dataset.pos);
    const piece = document.querySelectorAll(`[data-piecepos="${element.dataset.pos}"]`)[0]
    console.log(piece);
    piece.style.top = "0px"
    removeChilderen(dotholder)
    selectedElement = null
    element.onclick = () => {select(element)}
}



const ifArrayIsEmpty = (Array, message) => {
    if (Array.length === 0) {
        return message
    }
    else {
        return Array
    }
}

const removeChilderen = (element) => {
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild)
    }
    if(element.hasChildNodes()){console.log('removed green')}
    if(!element.hasChildNodes()){console.log('no green')}
}

const isundefined = (myVariable) => {
    if(myVariable === undefined){return true}
    else{return false}
}

