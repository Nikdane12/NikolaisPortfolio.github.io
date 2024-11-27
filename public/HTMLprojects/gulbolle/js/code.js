const startPage = document.getElementById("startPage");
const teamPageDiv = document.createElement("div");
const wordInputPage = document.createElement("div");
const gamePage = document.createElement("div");
gamePage.classList.add("gamepage")
const scoreBox = document.createElement("div")
const buttonBox = document.createElement("div");
buttonBox.classList.add("buttonBox");

const titlePage = document.createElement("div");
titlePage.classList.add("titlepage");

const teamDisplay = document.createElement("div");
teamDisplay.classList.add("teamDisplay");

const podiumpage = document.createElement("div");
podiumpage.classList.add("podium");

const timerElement = document.createElement("div");
timerElement.classList.add("timer")

// Settings Variables !!!

let theme = null;
let maxtime = 5; // FIX make customizable

// ______________

let teams = []
let wordBank = []
let usedWords = []
let currentTeam;
let currentTeamIndex = 0;    

let globaltime = 0;
let timerarr = [];

const createButton = (text) => {
    const buttonElement = document.createElement("button");
    buttonElement.classList.add("custombutton");
    const buttonSpan = document.createElement("span");
    buttonSpan.classList.add("button_top");
    buttonElement.append(buttonSpan);
    buttonSpan.append(text);

    return buttonElement;
}

const getWrappedIndex = (arr, index) => {
    return ((index % arr.length) + arr.length) % arr.length;
}

const colors = ["65, 105, 225", "220, 20, 60", "255, 215, 0", "34, 139, 34", "128, 0, 128"]

const startButton = createButton(document.createTextNode("Start"));
startPage.append(startButton);
const optionsButton = createButton(document.createTextNode("Options"));
startPage.append(optionsButton);
const modeSelectButton = createButton(document.createTextNode("Gamemodes"));
startPage.append(modeSelectButton);

startButton.addEventListener("click", (e) => { createTeamPage(); });
optionsButton.addEventListener("click", (e) => { openOptions(); });
modeSelectButton.addEventListener("click", (e) => { openGamemodes(); });

// FIX: remove default teams and words

class team {
    constructor(name = "default_team", color = "255, 0, 0", score = 0, correctWords = [], passWords = [], currentTime = maxtime) {
        this.name = name;
        this.color = color;
        this.score = score;
        this.correctWords = correctWords;
        this.passWords = passWords;
        this.currentTime = currentTime;
    }
}

const randomWords = [
    'apple','orange','banana','dog','cat','sun','moon','tree','book','happy','friend','green','water','run','jump','song','flower','smile','sleep','coffee'
];

const randomTeams = [
    "Dog team", "Cat team", "Fish team", "Bear team"
]

const gamemodeList = [
    {name: "CHARADES", id: "char", 
        howto:`<div>How to play Charades...</div><div class="title"> How to Act Out the Word </div><span>‧ A player from the active team picks a word or phrase (without showing it).</span><span>‧ They act it out silently using gestures and body movements. No talking, sounds, or spelling allowed.</span><div class="title">Guessing</div><span>‧ The acting player's teammates try to guess the word or phrase based on the actions.</span><span>‧ They have 1 to 2 minutes to guess correctly before time runs out.</span><div class="title">Scoring</div><span>‧ The team earns 1 point for each correct guess within the time limit.</span><span>‧ No points are awarded for incorrect guesses or skipped words.</span><span>‧ Rotate turns between teams until a set score is reached or time runs out.</span>`
    }, 
    {name: "ALIAS", id: "alias", 
        howto: `<div>How to play Alias...</div><div class="title">How to Describe the Word</div><span>‧ A player from the active team picks a word (without showing it).</span><span>‧ They describe the word using synonyms, explanations, or clues, but cannot say the word itself or use direct translations.</span><div class="title">Guessing</div><span>‧ The acting player's teammates try to guess the word based on the description.</span><span>‧ They have 1 to 2 minutes to guess as many words as possible before time runs out.</span><div class="title">Scoring</div><span>‧ The team earns 1 point for each correct guess within the time limit.</span><span>‧ No points are awarded for incorrect guesses or skipped words.</span><span>‧ Rotate turns between teams until a set score is reached or time runs out.</span>`
    }, 
    {name: "TABOO", id: "taboo", 
        howto: `<div>How to play Taboo...</div><div class="title">How to Describe the Word</div><span>‧ A player from the active team picks a card with a target word and a list of forbidden words.</span><span>‧ They describe the target word to their teammates without using any of the forbidden words listed on the card.</span><span>‧ They also cannot use gestures, sound effects, or spelling to convey the word.</span><div class="title">Guessing</div><span>‧ The acting player's teammates try to guess the target word based on the description.</span><span>‧ If the player accidentally says a forbidden word, the word gets passed</span><div class="title">Scoring</div><span>‧ The team earns 1 point for each correct guess within the time limit.</span><span>‧ No points are awarded for incorrect guesses or skipped words.</span><span>‧ Rotate turns between teams until a set score is reached or time runs out.</span>`
    },    
    {name: "PICTIONARY", id: "pict", 
        howto: `<div>How to play Pictionary...</div><div class="title">Setup</div><span>‧ Divide players into two or more teams. Each team takes turns drawing and guessing.</span><span>‧ Prepare a set of words or phrases to be drawn, either using a game deck or custom list.</span><span>‧ Provide a drawing surface (paper, whiteboard, or digital) and a timer.</span><div class="title">How to Play</div><span>‧ A player from the active team draws a word or phrase from the word bank.</span><span>‧ Without speaking, writing letters, or using gestures, the player must draw clues to represent the word or phrase.</span><span>‧ The teammates must guess the word or phrase within the time limit based on the drawing.</span><div class="title">Guessing</div><span>‧ Teammates can shout out as many guesses as they like within the time limit.</span><span>‧ The drawer cannot provide verbal hints, spell, or use non-drawing actions to aid guessing.</span><div class="title">Scoring</div><span>‧ The team earns 1 point for each correct guess before the timer runs out.</span><span>‧ No points are awarded if the team fails to guess correctly in time.</span><span>‧ Rotate turns between teams, and continue until a set score is reached or all words are used.</span>`
    }
    
]

let gamemodes = [gamemodeList[0], gamemodeList[1], gamemodeList[2]];
let unusedGamemodes = [];
gamemodeList.forEach(element => {
    if (!gamemodes.includes(element)) {
        unusedGamemodes.push(element);
    }
});

let currentMode = 0;
randomWords.forEach(element => {
    wordBank.push(element)
});

randomTeams.forEach((e, i) => {
    const newteam = new team(e, colors[getWrappedIndex(colors, i)], undefined, undefined, undefined, undefined);
    teams.push(newteam);
})

const createTeamPage = () => {
    removeAllAndHide(startPage);

    const teamscont = document.createElement("div");
    teamscont.classList.add("teamscont");
    const inputcont = document.createElement("div");
    inputcont.classList.add("inputcont");
    const nameinput = document.createElement("input");
    nameinput.type = "text";
    nameinput.value = "default_team";
    const addbutton = createButton(document.createTextNode("Add Team"));
    const finishbutton = createButton(document.createTextNode("Finish"));
    inputcont.append(nameinput)
    inputcont.append(addbutton)
    inputcont.append(finishbutton)
    teamPageDiv.append(inputcont)
    teamPageDiv.append(teamscont)
    document.body.append(teamPageDiv)
    teamPageDiv.classList.add("teamPageDiv")

    const updateteamlist = () =>{
        removeAll(teamscont)
        teams.forEach((e, i) => {
            const teamdiv = document.createElement("div")
            teamdiv.classList.add("teamdiv")

            teamdiv.style.backgroundColor = `rgba(${e.color}, var(--backA))`
            teamdiv.style.borderColor = `rgba(${e.color}, var(--borderA))`

            const indexdiv = document.createElement("div")
            indexdiv.classList.add("indexdiv")
            indexdiv.append(document.createTextNode(`${i+1}.`))
            const teamname = document.createElement("div");
            teamname.classList.add("teamname")
            teamname.append(document.createTextNode(e.name))
            teamscont.append(teamdiv)
            teamdiv.append(indexdiv)
            teamdiv.append(teamname)
        });
    }
    updateteamlist();

    const createteam = () => {
        if(nameinput.value){
            const newteam = new team(nameinput.value, colors[getWrappedIndex(colors, teams.length)], undefined, undefined, undefined, undefined);
            teams.push(newteam);
            nameinput.value = "";
        }
        else{
            openActionModal("Silly goose!", 
                "There isn't anything to input.", 
                null, () => {})
        }
        updateteamlist();
    }

    nameinput.addEventListener('keyup', event => {
        if (event.key === 'Enter') {
            createteam()
        }
    });

    addbutton.addEventListener("click", (e) => {
        createteam()
    });

    finishbutton.addEventListener("click", (e) => {
        if(teams.length == 0){
            openActionModal("Silly goose!", 
                "There aren't any teams.", 
                null, () => {})
        }
        else{
            createWordInputPage();
        }
        console.log("teams:", teams);
    });
}

const createWordInputPage = () => {
    removeSelf(teamPageDiv);
    const inputcont = document.createElement("div");
    inputcont.classList.add("inputcont");
    const wordscont = document.createElement("div");
    wordscont.classList.add("wordscont")
    const wordinput = document.createElement("input");
    wordinput.type = "text";
    wordinput.value = "default_word"; 
    const addbutton = createButton(document.createTextNode("Add Word"));
    const nextbutton = createButton(document.createTextNode("Next"));
    const finishbutton = createButton(document.createTextNode("Finish"));

    inputcont.append(wordinput)
    inputcont.append(addbutton)
    inputcont.append(nextbutton)
    inputcont.append(finishbutton)
    wordInputPage.append(inputcont)
    wordInputPage.append(wordscont)
    document.body.append(wordInputPage)

    

    const addtoWordList = word =>{
        const worddiv = document.createElement("div")
        worddiv.classList.add("worddiv");
        worddiv.append(document.createTextNode(word))
        wordscont.append(worddiv)
    }

    const checkWord = () => {
        if(wordinput.value){
            let word = wordinput.value.toLowerCase()
            const addWord = () =>{
                wordBank.push(word)
                addtoWordList(word)
                console.log("word added", word);

                wordinput.value = "";
            }
            const failedWord = () => {
                console.log("word failed", word);
                wordinput.value = "";
            }
            if (wordBank.includes(wordinput.value.toLowerCase())){
                openActionModal("Warning!", 
                `The word you are attempting to add is already included in the word-bank. Are you sure you want to add a duplicate word?: ${wordinput.value}`, 
                () => {addWord()}, () => {failedWord()})
            }
            else{addWord()}
        }
        else{
            openActionModal("Silly goose!", 
                "There isn't anything to input.", 
                null, () => {})
        }
    }

    wordinput.addEventListener('keyup', event => {
        if (event.key === "Enter") {
            checkWord()
        }
    });

    addbutton.addEventListener("click", (e) => {
        checkWord()
    });

    nextbutton.addEventListener("click", (e) => {
        removeAll(wordscont)
    });

    finishbutton.addEventListener("click", (e) => {
        if(wordBank.length == 0){
            openActionModal("Silly goose!", 
                "There aren't any words in the word-bank.", 
                null, () => {})
        }
        else{
            removeAll
            startGameMode(gamemodes[currentMode]);
        }
        console.log("wordbank:", wordBank);
    });
}

const titleElement = document.createElement("div");
titleElement.classList.add("pageTitle");

const startGameMode = (mode) => {
    if (typeof mode !== "undefined") {
        removeSelf(wordInputPage);

        currentTeam = teams[currentTeamIndex];

        const startButton = createButton(document.createTextNode("Start"));

        removeAll(titleElement);
        titleElement.append(mode.name);

        const howtoElement = document.createElement("div");
        howtoElement.classList.add("howtoElement")
        howtoElement.innerHTML = mode.howto;

        titlePage.append(titleElement);
        titlePage.append(howtoElement);
        titlePage.append(startButton);
        document.body.append(titlePage);
        

        startButton.addEventListener("click", (e) => {
            start();
        });

        const start = () => {
            removeSelf([startButton, howtoElement])
            removeAll(buttonBox)

            setTeam()
            startTeam()
            // const readyButton = createButton(document.createTextNode("Ready?"));
            // buttonBox.append(readyButton)
            // gamePage.append(buttonBox);
            document.body.append(gamePage);

            // readyButton.addEventListener("click", (e) => {
            //     removeSelf(readyButton)
            //     displayWord();
            //     addbuttons();

            //     resettime();
            // });
        }

        const startTeam = () => {
            removeAll(buttonBox)
            const readyButton = createButton(document.createTextNode("Ready?"));
            buttonBox.append(readyButton)
            gamePage.append(buttonBox);
            
            readyButton.addEventListener("click", (e) => {
                removeSelf(readyButton)
                displayWord();
                addbuttons();
                resettime();
            });
        }

        

        const setTeam = () => {     
            removeAll(teamDisplay)  
            const teamText = document.createElement("div");
            teamText.append(document.createTextNode(currentTeam.name));
            teamText.classList.add("teamText");
            teamDisplay.append(teamText);

            gamePage.append(teamDisplay);
            // FIX: set theme color instead of individual elements
            teamDisplay.style.backgroundColor = `rgba(${currentTeam.color}, var(--backA))`;
            teamDisplay.style.borderColor = `rgba(${currentTeam.color}, var(--borderA))`

            scoreBox.style.right = "25px";
            scoreBox.style.position = "absolute";
            teamDisplay.append(scoreBox)
            updateScore();

            removeSelf(wordDisplay)
        }
        
        let currentWord
        const wordDisplay = document.createElement("div");
        wordDisplay.classList.add("wordDisplay");
        

        const displayWord = () => {
            gamePage.append(wordDisplay);
            removeAll(wordDisplay)
            let word = getRandomUnusedWord()

            const wordText = document.createElement("div");
            wordText.classList.add("tilt_anim");
            // FIX: wordText shouldnt have tilt class
            
            wordDisplay.append(wordText);

            if(word !== null){
                wordText.append(document.createTextNode(word))
                currentWord = word
            }
            else{
                textpopup("OUT OF WORDS", 1000)
                console.log("OUT OF WORDS");

                currentTeam.currentTime = globaltime;                

                stopALLtime();
                
                usedWords = [];

                removeAll(buttonBox);          
                if(typeof gamemodes[currentMode + 1] !== "undefined"){
                    nextgamemodeButton = createButton(document.createTextNode("Next Gamemode"))
                    nextgamemodeButton.addEventListener("click", (e) => {
                        currentMode++
                        removeSelf(gamePage)
                        startGameMode(gamemodes[currentMode]);
                    });
                    buttonBox.append(nextgamemodeButton);
                }
                else{
                    const endgamebutton = createButton(document.createTextNode("End Game"));
                    endgamebutton.addEventListener("click", (e) => {
                        endGame();
                    });
                    buttonBox.append(endgamebutton);

                    if (teamDisplay) {removeSelf(teamDisplay);}
                    if (wordDisplay) {removeSelf(wordDisplay);}
                }
            }
            return word
        }

        const addbuttons = () => {
            removeAll(buttonBox);

            const correctButton = createButton(document.createTextNode("Correct"));
            buttonBox.append(correctButton);

            correctButton.addEventListener("click", (e) => {
                correctORpass("correct")
            });

            const passButton = createButton(document.createTextNode("Pass"))
            buttonBox.append(passButton);

            passButton.addEventListener("click", (e) => {
                correctORpass("pass")
            });

            // const TESTtimeUpButton = createButton(document.createTextNode("Time's Up"))
            
            // TESTtimeUpButton.addEventListener("click", (e) => {
            //     nextTeam()
            // });


            gamePage.append(buttonBox);
        }

        const resettime = () => {
            console.log("reset time!!!!");
            
            console.log(currentTeam.currentTime);
            
            timerElement.style.marginLeft = "auto";
            buttonBox.append(timerElement);

            let timer = new easytimer.Timer();
            
            timerarr.push(timer);

            timerElement.innerHTML = timer.getTimeValues().toString();
            timer.addEventListener('secondTenthsUpdated', (e) => {
                timerElement.innerHTML = timer.getTimeValues().toString(['minutes', 'seconds', 'secondTenths']);
                globaltime = timer.getTimeValues().seconds;
            });

            if(currentTeam.currentTime < 1){
                currentTeam.currentTime = 0
            }

            const handleTargetAchieved = () => {
                timer.removeEventListener('targetAchieved', handleTargetAchieved);
                timer = null;
                currentTeam.currentTime = maxtime;
                nextTeam();
                textpopup("Time's Up", 2000)
            }
            
            timer.removeEventListener('targetAchieved', handleTargetAchieved);
            timer.addEventListener('targetAchieved', handleTargetAchieved);
            timer.start({precision: 'secondTenths', countdown: true, startValues: {seconds: currentTeam.currentTime}, target:{seconds:0}});
        }

        const stopALLtime = () => {
            timerarr.forEach(timer => {
                if(timer.isRunning()){
                    timer.stop();
                }                
            });
        }

        const updateScore = () => {
            removeAll(scoreBox);
            scoreBox.append(currentTeam.score);
        }

        const nextTeam = () => {
            
            currentTeamIndex = (currentTeamIndex + 1) % teams.length;
            currentTeam = teams[currentTeamIndex];
            
            removeSelf(wordDisplay)
            setTeam();
            startTeam();
            updateScore();
        }

        const correctORpass = (x) => {
            switch (x) {
                case "correct":
                    currentTeam.score ++
                    currentTeam.correctWords.push(currentWord)
                    useWord(currentWord)
                    break;
                case "pass":
                    currentTeam.score --
                    currentTeam.passWords.push(currentWord)
                    break;
                default:
                    console.log("Error in correct/pass buttons");
                    break;
            }
            updateScore()
            displayWord()
        }
    }
    // else{
    //     endGame()
    // }
}

const goldsvg = document.createElement("div");
goldsvg.innerHTML = `<img src="/HTMLprojects/gulbolle/img/Gold.svg" onload="SVGInject(this,{makeIdsUnique:false,useCache:false})">`;
const silversvg = document.createElement("div");
silversvg.innerHTML = `<img src="/HTMLprojects/gulbolle/img/Silver.svg" onload="SVGInject(this,{makeIdsUnique:false,useCache:false})">`;
const bronzesvg = document.createElement("div");
bronzesvg.innerHTML = `<img src="/HTMLprojects/gulbolle/img/Bronze.svg" onload="SVGInject(this,{makeIdsUnique:false,useCache:false})">`;

const endGame = () => {
    removeAll(gamePage);
    removeAll(titleElement);
    titleElement.append(document.createTextNode("Congratulations!"));

    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

    sortedTeams.forEach((e, i) => {
        const podiumElement = document.createElement("div");
        podiumElement.classList.add("podiumelement");


        if (i === 0) {
            goldsvg.classList.add("gold");
            podiumElement.append(goldsvg);
        } else if (i === 1) {
            silversvg.classList.add("silver");
            podiumElement.append(silversvg);
        } else if (i === 2) {
            bronzesvg.classList.add("bronze");
            podiumElement.append(bronzesvg);
        };

        const podiumstats = document.createElement("div");
        podiumstats.classList.add("podstats")

        const name = document.createElement("div");
        name.append(document.createTextNode(e.name))
        name.classList.add("podname");

        const score = document.createElement("div");
        score.append(document.createTextNode(e.score))
        score.classList.add("podscore");

        podiumstats.append(name);
        podiumstats.append(score);
        podiumstats.style.backgroundColor = `rgba(${e.color}, var(--backA))`;
        podiumstats.style.borderColor = `rgba(${e.color}, var(--borderA))`;

        podiumElement.append(podiumstats);
        podiumpage.append(podiumElement);
    });

    gamePage.append(podiumpage);
};

const openOptions = () => {
    const {modalBACK, modal} = openOptionModal("Options");

    const maxtimeopt = document.createElement('div');
    maxtimeopt.append(document.createTextNode("Guess Time (seconds):"))

    maxtimeopt.style.display = 'flex';
    maxtimeopt.style.justifyContent = 'space-between';

    const timeinput = document.createElement('input');
    timeinput.value = maxtime;
    timeinput.type = 'number';
    timeinput.min = 0;
    timeinput.max = 300;
    timeinput.addEventListener('input', () => {
        maxtime = timeinput.value;
    });
    
    maxtimeopt.append(timeinput);
    modal.append(maxtimeopt);
}

const openGamemodes = () => {
    const {modalBACK, modal} = openOptionModal("Gamemodes");
    const contianer = document.createElement('div');
    contianer.style.display = "flex";
    contianer.style.flexDirection = "column";
    contianer.style.gap = "10px";

    const primaryContainer = document.createElement('div');
    primaryContainer.classList.add("gamemodeModalList");
    const secondaryContainer = document.createElement('div');
    secondaryContainer.classList.add("gamemodeModalSecondList");
    const addCustomButton = createButton("Add Custom Game");
    
    const renderItems = () => {
        primaryContainer.innerHTML = "";
        gamemodes.forEach((item, index) => {
            const div = document.createElement('div');
            div.classList.add("modallistitem");
            div.innerHTML = `
                <div>
                    <button class="up ${index === 0 ? 'disabled' : ''}" data-index="${index}">▲</button>
                    <button class="down ${index === gamemodes.length - 1 ? 'disabled' : ''}" data-index="${index}">▼</button>
                </div>
                <div>${item.name}</div>
                <button class="remove ${gamemodes.length === 1 ? 'disabled' : ''}" data-index="${index}" style="margin-left: auto">X</button>
            `;
            primaryContainer.appendChild(div);
        });
    }

    const renderSecondaryItems = () => {
        secondaryContainer.innerHTML = "";
        unusedGamemodes.forEach((item, index) => {
            const div = document.createElement('div');
            div.classList.add("modallistitem");
            div.innerHTML = `
                <button class="add" data-index="${index}">+</button>
                <div>${item.name}</div>
            `;
            secondaryContainer.appendChild(div);
        });
    };

    const moveItem = (index, direction) => {
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < gamemodes.length) {
            [gamemodes[index], gamemodes[newIndex]] = [gamemodes[newIndex], gamemodes[index]];
            renderItems();
        }
    }

    primaryContainer.addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON") {
            const index = parseInt(event.target.getAttribute("data-index"), 10);
            if (event.target.classList.contains("up")) {
                moveItem(index, -1);
            } else if (event.target.classList.contains("down")) {
                moveItem(index, 1);
            } else if (event.target.classList.contains("remove")) {
                if(gamemodes.length !== 1){                    
                    const removedGame = gamemodes.splice(index, 1)[0];                
                    if(removedGame.id !== "other"){unusedGamemodes.push(removedGame)}
                }
                
                renderItems();
                renderSecondaryItems();
            }
        }
    });
    secondaryContainer.addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON" && event.target.classList.contains("add")) {
            const index = parseInt(event.target.getAttribute("data-index"), 10);
            // Add unused game mode to primary list
            gamemodes.push(unusedGamemodes.splice(index, 1)[0]);
            renderItems();
            renderSecondaryItems();
        }
    });

    addCustomButton.addEventListener("click", () => {
        const customGame = {
            name: "Other", id: "other", 
            howto: `<div class="title">It's up to you to decide what to play this round.</div>`
        };
        gamemodes.push(customGame);
        renderItems();
    });

    const divider = document.createElement("hr");
    divider.style.margin = "0";

    renderItems();
    renderSecondaryItems();
    contianer.append(primaryContainer);
    contianer.append(divider)
    contianer.append(secondaryContainer);
    contianer.append(addCustomButton);
    
    modal.append(contianer);
}


let lastWord = null;
const getRandomUnusedWord = () => {
    if (usedWords.length !== wordBank.length) {
        let randomWord;
        do {
            randomWord = wordBank[Math.floor(Math.random() * wordBank.length)];
        } while (usedWords.includes(randomWord) || randomWord === lastWord); 

        lastWord = randomWord; 
        return randomWord;
    } else {
        return null;
    }
};

const useWord = (randomWord) => {
    usedWords.push(randomWord);
}


const openActionModal = (header, text, confirmAct, cancelAct) => {
    const modalBACK = document.createElement("div");
    modalBACK.classList.add("modalBACK")

    const modal = document.createElement("div");
    modal.classList.add("modal");

    const headerElement = document.createElement("div");
    headerElement.append(header);
    headerElement.classList.add("title");
    modal.append(headerElement)

    const textElement = document.createElement("div");
    textElement.append(text);
    modal.append(textElement)

    const buttonCont = document.createElement("div");
    buttonCont.classList.add("buttonCont");
    modal.append(buttonCont)
    
    modalBACK.append(modal)
    document.body.append(modalBACK)

    if(confirmAct){
        const confirmBut = createButton(document.createTextNode("Confirm"))
        buttonCont.append(confirmBut)

        confirmBut.addEventListener("click", (e) => {
            removeSelf(modalBACK)
            confirmAct()
        });
    }
    if(cancelAct){
        const cancelBut = createButton(document.createTextNode("Cancel"))
        buttonCont.append(cancelBut)

        cancelBut.addEventListener("click", (e) => {
            removeSelf([modalBACK])
            cancelAct()
        });
        modalBACK.addEventListener('click', (e) => removeSelf(modalBACK));
        modal.addEventListener('click', e => e.cancelBubble = true);
    }
}

const openOptionModal = (header) => {
    const modalBACK = document.createElement("div");
    modalBACK.classList.add("modalBACK")

    const modal = document.createElement("div");
    modal.classList.add("modal");

    const closeButton = document.createElement('div');
    closeButton.append(document.createTextNode("X"))
    closeButton.classList.add("modalClose");
    closeButton.addEventListener("click", (e) => {
        removeSelf([modalBACK])
    });
    modal.append(closeButton)

    const headerElement = document.createElement("div");
    headerElement.append(header);
    headerElement.classList.add("title");
    modal.append(headerElement)

    modalBACK.append(modal)
    document.body.append(modalBACK)

    modalBACK.addEventListener('click', (e) => removeSelf(modalBACK));
    modal.addEventListener('click', e => e.cancelBubble = true);

    return {modalBACK, modal}
}

const removeSelf = input => {
    if (input.parentNode) {
        input.parentNode.removeChild(input);
    } else if (Array.isArray(input)) {
        input.forEach(element => {
            element.parentNode.removeChild(element);
        });
    }
}

const removeAll = input => {
    while(input.firstChild){input.removeChild(input.firstChild)};
}

const removeAllAndHide = div => {
    while(div.firstChild){div.removeChild(div.firstChild)};
    div.style.display = 'none';
}

const findTopTeams = (teams) => {
    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

    const gold = sortedTeams[0] || null;
    const silver = sortedTeams[1] || null;
    const bronze = sortedTeams[2] || null;

    return { gold, silver, bronze };
}

const textpopup = (text, fadetime) => {
    const div = document.createElement("div");
    div.classList.add("textpopup")
    div.append(document.createTextNode(text))
    document.body.append(div)

    setInterval(() => {
        removeSelf(div)
    }, fadetime);
}

/* 
THINGS TO FIX

[x] "OUT OF WORDS" not removing
[x] Timer not stopping
[ ] fix bounce anim
[x] popup clickthrough
[ ] rnd teams get old maxtime
[ ] remove default teams

THINGS TO IMPLEMENT LATER

[ ] instructs up front
[x] choose game order/selection
[ ] save prefs
[ ] clarify how add words works
[ ] total words in list
[ ] remove teams/words
[ ] in-game word count (words left)
[ ] quit/restart button
[ ] stop/skip game
[ ] button make fun name
[x] swap font 

*/