let winSize = {x:window.innerWidth, y:window.innerHeight} 
let hozCont
let verCont
const startup = () => {
    hozCont = new Container(400, 100, 500, 200, "horizontal")
    database.cardLibrary.forEach(e => {
        const billCard = new Card({id: e.id, draggable: true})
        hozCont.addCard(billCard);
    });
    document.body.append(hozCont.element);
    verCont = new Container(100, 200, 150, 400, "vertical")
    database.cardLibrary.forEach(e => {
        const billCard = new Card({id: e.id, draggable: true})
        verCont.addCard(billCard);
    });
    document.body.append(verCont.element);
}

const imgpath = "/HTMLprojects/cardgame/img/"
let defZIndex = 0;
const topZIndex = "999";
let prevTopCard = null;

class Card {
    static idCounter = 0;
    constructor({ id = "blank", texture, draggable = false, width = 128, height = 178, scale = 1 }) {
        this.id = Card.idCounter++;
        this.nameid = id;
        this.texture = texture;
        this.draggable = draggable;
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.element = null;
        this.createCardElement();
        if(draggable){this.addDragFunctionality(this.element)}
    }

    createCardElement() {
        const cardElement = document.createElement('div');
        cardElement.style.width = `${this.width * this.scale}px`;
        cardElement.style.height = `${this.height * this.scale}px`;
        cardElement.style.position = "absolute";
        cardElement.style.userSelect = "none";
        cardElement.style.zIndex = `${defZIndex}`;

        const img = document.createElement('img');
        img.src = getTexture(this.nameid); 
        img.style.imageRendering = "pixelated";
        img.draggable = false;
        cardElement.append(img);
        this.element = cardElement;
        return cardElement;
    }
    addDragFunctionality(card) {
        let offsetX = 0;
        let offsetY = 0;
        let isDragging = false;

        card.addEventListener('mousedown', (event) => {
            offsetX = event.clientX - card.offsetLeft;
            offsetY = event.clientY - card.offsetTop;

            isDragging = true;
            card.style.cursor = 'grabbing';
            if(prevTopCard){
                prevTopCard.style.zIndex = defZIndex
                defZIndex++;
            };
            card.style.zIndex = topZIndex
            prevTopCard = card;
        });

        document.addEventListener('mousemove', (event) => {
            if (isDragging) {
                card.style.left = `${event.clientX - offsetX}px`;
                card.style.top = `${event.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                card.style.cursor = 'grab';
            }
        });
    }

    goHome(){
        
    }
}

const cardmaker = (options = {}) => {
    const card = new Card(options);
    return card.createCardElement();
};

const preferredType = "_full_color"

const database = {
    avalibleTypes: ["_full_color", "_color"],
    cardLibrary: [
        { name: "Bill Card", id: "bill", path: "billcard", avalibleTypes: ["_full_color", "_color"],},
        { name: "Amongus Card", id: "amongus", path: "amonguscard", avalibleTypes: ["_color"],},
        { name: "Bosco Card", id: "bosco", path: "boscocard", avalibleTypes: ["_full_color", "_color"],},
        { name: "Vault-boy Card", id: "vaultboy", path: "vaultboycard", avalibleTypes: ["_full_color", "_color"],},
        { name: "Blank Card", id: "blank", path: "blankcard", avalibleTypes: [],},
    ]
}
const getTexture = (cardId) => {
    const card = database.cardLibrary.find(c => c.id === cardId);    
    if (!card) {
        console.error(`Card with ID "${cardId}" not found.`);
        return "";
    }

    if (preferredType && card.avalibleTypes.includes(preferredType)) {
        return `${imgpath}${card.path}${preferredType}.png`;
    }

    for (const type of database.avalibleTypes) {
        if (card.avalibleTypes.includes(type)) {
            return `${imgpath}${card.path}${type}.png`;
        }
    }
    return `${imgpath}${card.path}.png`;
}

const summonAllCards = () => {
    database.cardLibrary.forEach((element, index) => {
        document.body.append(cardmaker({id: element.id, draggable: true}))
    });
}

const summonCard = (id) => {
    document.body.append(cardmaker({id: id, draggable: true}))
}

const typesOfContainer = [
    "horizontal", "vertical", "array"
];

class Container {
    #padding;
    #cellArray;
    #cellWidth;
    #cellHeight;
    constructor(posx = 0, posy = 0, width = 500, height = 500, type = "horizontal", padding = 10) {
        if (!typesOfContainer.includes(type)) {
            throw new Error(`Invalid container type: ${type}. Must be one of: ${typesOfContainer.join(", ")}`);
        }
        this.posx = posx;
        this.posy = posy;
        this.height = height;
        this.width = width;
        this.type = type;
        this.cards = {};
        this.element = null;
        this.#cellArray = [];
        this.#cellWidth = 0;
        this.cellHeight = 0;
        this.#padding = padding;
        this.createCont();
        this.createCell();
    }

    createCell(){
        const cellElement = document.createElement('div');
        if(this.type === "horizontal"){
            cellElement.style.height = "100%";
            this.#cellHeight = this.height
        } else if (this.type === "vertical") {
            cellElement.style.width = "100%";
            this.#cellWidth = this.width
        }
        cellElement.style.position = "absolute";
        cellElement.style.border = "2px solid black";
        this.element.append(cellElement);
        this.#cellArray.push(cellElement);
        this.updateCells();

        // cell.addEventListener
    }

    updateCells(){
        this.#cellArray.forEach((e, i) => {
            if(this.type === "horizontal"){
                const width = (this.width - (2 * this.#padding)) / this.#cellArray.length
                e.style.width = `${width}px`;
                e.style.left = `${this.#padding + (width * i)}px`
                this.#cellWidth = width;
            } else if (this.type === "vertical") {
                const height = (this.height - (2 * this.#padding)) / this.#cellArray.length
                e.style.height = `${height}px`;
                e.style.top = `${this.#padding + (height * i)}px`
                this.#cellHeight = height;
            }
        });
    }

    createCont(){
        const element = document.createElement('div');
        element.style.width = `${this.width}px`;
        element.style.height = `${this.height}px`;
        element.style.position = "absolute"
        element.style.left = `${this.posx}px`;
        element.style.top = `${this.posy}px`;
        element.style.backgroundColor = "green";

        this.element = element;
        return element
    }

    addCard(card) {
        if (!this.cards[card.id]) {
            this.cards[card.id] = card;
            
            this.updateCardPositions();
            if(this.element !== null && card.element !== null){
                this.createCell();
                this.element.append(card.element)
            }
        } else {
            console.warn(`Card with ID ${card.id} is already in the container.`);
        }
    }

    removeCard(cardId) {
        if (this.cards[cardId]) {
            delete this.cards[cardId];
            this.updateCardPositions();
        } else {
            console.warn(`Card with ID ${cardId} not found in the container.`);
        }
    }

    clearCards() {
        this.cards = {};
    }

    listCards() {
        return Object.values(this.cards);
    }

    updateCardPositions() {
        const cardArray = this.listCards();
        const count = cardArray.length;
        

        if (count === 0) return;

        if (this.type === "horizontal") {
            cardArray.forEach((card, index) => { 
                
                // const offsetX = (this.width - (count * card.width)) / 2
                // const posX = offsetX + (((2 * offsetX) + card.width) * index)

                // const posY = (this.height - card.height) / 2
                const posX = this.#padding + (this.#cellWidth * index) + (this.#cellWidth/2) - (card.width/2);
                const posY = (this.#cellHeight/2) - (card.height/2);

                card.element.style.left = `${posX}px`;
                card.element.style.top = `${posY}px`;
            });
        } else if (this.type === "vertical") {
            cardArray.forEach((card, index) => {
                // const y = (this.width - (card.width * count)) / (2 * count)
                // const x = (this.height - card.height) / 2
                // card.element.style.left = `${x}px`;
                // card.element.style.top = `${y + ((card.width + (2 * y)) * index)}px`;

                const posX = (this.#cellWidth/2) - (card.width/2);
                const posY = this.#padding + (this.#cellHeight * index) + (this.#cellHeight/2) - (card.height/2);

                card.element.style.left = `${posX}px`;
                card.element.style.top = `${posY}px`;
            });
        }
    }
}