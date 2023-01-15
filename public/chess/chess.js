let chessboard

const gamePieces = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king']

const startup = () => {
    chessboard = document.getElementById('chessboard')
    renderBoard()
    addPieces()
}

const renderBoard = () => {
    for (var i = 0; i < 64; ++i) {
        const chesssquare = document.createElement('div')
        chesssquare.classList.add('chesssquare')
        chessboard.appendChild(chesssquare)
    }
}

let injecter = `onload="SVGInject(this,{makeIdsUnique:false,useCache:false})"`

const addPieces = () => {
    const chesssquare = document.getElementsByClassName('chesssquare')
    for (var i = 8; i < 16; ++i) {
        chesssquare[i].innerHTML = `<img src="/chess/SVG/${gamePieces[0]}.svg" ${injecter}>`
    }
    chesssquare[0].innerHTML = `<img src="/chess/SVG/${gamePieces[3]}.svg" ${injecter}>`
    chesssquare[7].innerHTML = `<img src="/chess/SVG/${gamePieces[3]}.svg" ${injecter}>`
    chesssquare[1].innerHTML = `<img src="/chess/SVG/${gamePieces[1]}.svg" ${injecter}>`
    chesssquare[6].innerHTML = `<img src="/chess/SVG/${gamePieces[1]}.svg" ${injecter}>`
    chesssquare[2].innerHTML = `<img src="/chess/SVG/${gamePieces[2]}.svg" ${injecter}>`
    chesssquare[5].innerHTML = `<img src="/chess/SVG/${gamePieces[2]}.svg" ${injecter}>`
    chesssquare[3].innerHTML = `<img src="/chess/SVG/${gamePieces[4]}.svg" ${injecter}>`
    chesssquare[4].innerHTML = `<img src="/chess/SVG/${gamePieces[5]}.svg" ${injecter}>`
    for (var i = 48; i < 56; ++i) {
        chesssquare[i].innerHTML = `<img src="/chess/SVG/${gamePieces[0]}.svg" class="white" ${injecter}>`
    }
    chesssquare[56].innerHTML = `<img src="/chess/SVG/${gamePieces[3]}.svg" class="white" ${injecter}>`
    chesssquare[63].innerHTML = `<img src="/chess/SVG/${gamePieces[3]}.svg" class="white" ${injecter}>`
    chesssquare[57].innerHTML = `<img src="/chess/SVG/${gamePieces[1]}.svg" class="white" ${injecter}>`
    chesssquare[62].innerHTML = `<img src="/chess/SVG/${gamePieces[1]}.svg" class="white" ${injecter}>`
    chesssquare[58].innerHTML = `<img src="/chess/SVG/${gamePieces[2]}.svg" class="white" ${injecter}>`
    chesssquare[61].innerHTML = `<img src="/chess/SVG/${gamePieces[2]}.svg" class="white" ${injecter}>`
    chesssquare[59].innerHTML = `<img src="/chess/SVG/${gamePieces[4]}.svg" class="white" ${injecter}>`
    chesssquare[60].innerHTML = `<img src="/chess/SVG/${gamePieces[5]}.svg" class="white" ${injecter}>`
}

const selectPiece = (x) => {
    if (chesssquare[x].hasChildNodes()) {
        if (chesssquare[x].classList.contains('white')) {
            console.log(0)
        }
        else {

        }
    }
}

const findLegalMoves = (x) => {
    let legalMoves = new Array();
    if (chesssquare[x].innerHTML == `<img src="/chess/SVG/${gamePieces[0]}.svg" class="white" ${injecter}>`) {
        if (!chesssquare[x - 8].hasChildNodes) {
            legalMoves.add(x - 8)
        }
        if (x >= 48 && x < 56) {
            if (!chesssquare[x - 16].hasChildNodes) {
                legalMoves.add(x - 16)
            }
        }
    }
    console.log(legalMoves)
}

for (int i: findLegalMoves(48)) {
    chesssquare[i] = lime
}
// Math.floor(Math.random()* 5)
