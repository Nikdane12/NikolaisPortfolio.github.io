// https://github.com/jhlywa/chess.js/blob/master/README.md

let blockcont = document.getElementById('blockcont')
let pieceholder = document.getElementById('pieceholder')
let dotholder = document.getElementById('dotholder')
let selectedElement
let movesBlock 
const chess = new Chess()
// 'rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3'

const startup = () => {
    createTiles()
    console.log(chess.ascii());
    addPieces()
    selectedElement = null
    // give every block a onclick that selects itself
    const singleblocks = Array.from(document.getElementsByClassName('singleblock'))
    singleblocks.forEach((element, index) => {
        element.onclick = () => {select(element)}
    })
    window.onresize = () => {
        const piece = document.getElementsByClassName('piece')
        const greendot = document.getElementsByClassName('Gdotcont')
        Array.from(piece).forEach(element => {
            const pieceBlock = document.querySelectorAll(`[data-pos="${element.dataset.piecepos}"]`)[0]
            setPos(element, pieceBlock)
        })
        Array.from(greendot).forEach(element => {
            const greendotplace = document.querySelectorAll(`[data-pos="${element.dataset.dotpos}"]`)[0]
            setPos(element, greendotplace)
        });
    }
}

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

const resetTiles = () => {
    const tiles = document.querySelectorAll('.singleblock')
    tiles.forEach(element => {
        const square = chess.get(element.dataset.pos) || 'empty'
        element.dataset.piecetype = square.type || 'empty'
        element.dataset.piececolor = square.color || 'empty'
    })
}



const findPos = (element) => {
    const wrapperPosX = blockcont.getBoundingClientRect().left
    const positionX = element.getBoundingClientRect().left
    const distanceX = positionX + (element.clientWidth / 2)
    const wrapperPosY = blockcont.getBoundingClientRect().top
    const positionY = element.getBoundingClientRect().top
    const distanceY = positionY + (element.clientHeight / 2)
    return [distanceX, distanceY]
}

const setPos = (currentpos, newpos) => {
    const offsetX = (currentpos.clientWidth / 2)
    const offsetY = (currentpos.clientHeight / 2)
    const [distanceX, distanceY] = findPos(newpos)
    currentpos.style.transform = `translate(${distanceX - offsetX}px, ${distanceY - offsetY}px)`
    // console.log(distanceX, -element.clientWidth, distanceY, -element.clientHeight);
    // element.style.top = distanceY - element.clientHeight + "px"
    // element.style.left = distanceX - element.clientWidth + "px"
}
const addPieces = () => {
    ["p","k","n","b","q","r"].forEach(piecetype => {
        const cont = document.querySelectorAll(`div[data-piecetype="${piecetype}"]`)
        cont.forEach((element, index) => {
            pieceholder.innerHTML += `<div class="piece ${element.dataset.piecetype} ${element.dataset.piececolor == 'w' ? 'white' : 'black'}" data-piecepos="${cont[index].dataset.pos}" ></div>`
            const piece = document.getElementsByClassName(piecetype)[index]
            setPos(piece, element)
        })
    })
}




const select = (element) => {
    if (selectedElement == element) {
        console.log('deselect', selectedElement);
        deselect(selectedElement)
    }
    else {
        console.log('else');
        console.log('pos:', element.dataset.pos, 'type:', element.dataset.piecetype, 'color:', element.dataset.piececolor, 'moves:', ifArrayIsEmpty(chess.moves({ square: element.dataset.pos }), 'noMoves'))
        const piece = document.querySelectorAll(`[data-piecepos="${element.dataset.pos}"]`)[0]
        if (!isundefined(piece)) { piece.style.top = -10 + "px" }
        if (ifArrayIsEmpty(chess.moves({ square: element.dataset.pos }))) {
            chess.moves({ square: element.dataset.pos }).forEach((value, index) => {
                const div = document.createElement('div')
                div.classList.add('Gdotcont')
                const greendot = document.createElement('div')
                greendot.classList.add("greendot")
                div.appendChild(greendot)
                dotholder.appendChild(div)
                const avalibleMoves = chess.moves({ square: element.dataset.pos })
                div.dataset.dotpos = cutStrings(avalibleMoves[index])
                console.log(cutStrings(avalibleMoves[index]))
                movesBlock = document.querySelectorAll(`div[data-pos="${cutStrings(avalibleMoves[index])}"]`)[0]
                setPos(div, movesBlock)
                console.log('green');
                const movesBlockOnClick = () => {
                    if (movesBlock) {
                        movesBlock.removeEventListener('click', movesBlockOnClick)
                        movePiece(element.dataset.pos, cutStrings(avalibleMoves[index]))
                        movesBlock = null
                    }
                }
                movesBlock.addEventListener('click', movesBlockOnClick)
            })
        }
        if (selectedElement) {
            deselect(selectedElement)
        }
        element.onclick = () => {select(element)}
        selectedElement = element;
    }
}



const movePiece = (from, to) => {
    // deselect currently selected piece
    selectedElement = null
    // use library to move pieces
    chess.move({ from: `${from}`, to: `${to}` })
    console.log(chess.ascii());
    console.log('move:', from, to);
    const element = document.querySelectorAll(`[data-piecepos="${from}"]`)[0]
    const fromElement = document.querySelectorAll(`[data-pos="${from}"]`)[0]
    const toElement = document.querySelectorAll(`[data-pos="${to}"]`)[0]
    console.log(element, from);
    // actually move the piece
    setPos(element, toElement)
    //update piece and block data
    element.dataset.piecepos = to
    fromElement.dataset.piecetype = chess.get(from) ? chess.get(from).type : 'empty'
    fromElement.dataset.piececolor = chess.get(from) ? chess.get(from).color : 'empty'
    toElement.dataset.piecetype = chess.get(to).type
    toElement.dataset.piececolor = chess.get(to).color
    // lower selected piece
    element.style.top = "0px"
    //remove avalible pieces
    removeChilderen(dotholder)
    // change whos turn
    spinTurn()
}

const deselect = (element) => {
    console.log('deselected');
    // find whos piece is on this block
    const foo = document.querySelectorAll(`[data-piecepos="${element.dataset.pos}"]`)[0]
    // lower piece
    foo.style.top = "0px"
    // remove avalible pieces
    removeChilderen(dotholder)
    // deselect piece
    selectedElement = null
    // reset onclick
    element.onclick = () => { select(element) }
}

const reset = () => {
    chess.reset()
    removeChilderen(pieceholder);
    resetTiles()
    addPieces()
    spinTurn()
}

const spinTurn = () => {
    const spinner = document.getElementById('spinner')
    if (chess.turn() == 'w') {
        spinner.style.transform = "rotate(180deg)"
    }
    else {
        spinner.style.transform = "rotate(0deg)"
    }
}

const cutStrings = (str) => {
    const arr = [];
    for (let i = 0; i < 64; i++) {
        const newNumber = Math.floor(i / 8) + 1;
        const letter = String.fromCharCode(97 + i % 8);
        arr.push(letter + newNumber);
    }
    return arr.find(value => str.includes(value))
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
    if(!element.hasChildNodes()){console.log('no child')}
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild)
    }
    if(element.hasChildNodes()){console.log('removed')}
    
}

const isundefined = (myVariable) => {
    if (myVariable === undefined) { return true }
    else { return false }
}

