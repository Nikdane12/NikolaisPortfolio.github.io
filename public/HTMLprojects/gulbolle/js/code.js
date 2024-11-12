

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


const maxtime = 10; // FIX make customizable

let teams = []
let wordBank = []
let usedWords = []
let currentTeam;
let currentTeamIndex = 0;    

let globaltime = 0;

const createButton = (text) => {
    const buttonElement = document.createElement("button");
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
startButton.addEventListener("click", (e) => {
    createTeamPage();
});

// class team {
//     name = "default_team";
//     color = "255, 0, 0";
//     score = 0;
//     correctWords;
//     passWords;
//     currentTime = maxtime;

//     constructor(name, color, score, correctWords, passWords, currentTime) {
//         this.name = name;
//         this.color = color;
//         this.score = score;
//         this.correctWords = correctWords;
//         this.passWords = passWords;
//         this.currentTime = currentTime;
//     }
// }

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

const gamemodes = [
    {name: "CHARADES", id: "char", 
        howto:`<div>How to play Charades...</div>
        <div class="title"> How to Act Out the Word </div>
        <span>‧ A player from the active team picks a word or phrase (without showing it).</span>
        <span>‧ They act it out silently using gestures and body movements. No talking, sounds, or spelling allowed.
        </span>
        <div class="title">Guessing</div>
        <span>‧ The acting player's teammates try to guess the word or phrase based on the actions.</span>
        <span>‧ They have 1 to 2 minutes to guess correctly before time runs out.</span>
        <div class="title">Scoring</div>
        <span>‧ If the team guesses correctly within the time limit, they earn 1 point.</span>
        <span>‧ If they don't guess in time, no points are awarded.</span>
        <span>‧ Rotate turns between teams until a set score is reached or time runs out.</span>`
    }, 
    {name: "ALIAS", id: "alias", 
        howto: `<div>How to play Alias...</div>
        <div class="title">How to Describe the Word</div>
        <span>‧ A player from the active team picks a word (without showing it).</span>
        <span>‧ They describe the word using synonyms, explanations, or clues, but cannot say the word itself or use direct translations.</span>
        <div class="title">Guessing</div>
        <span>‧ The acting player's teammates try to guess the word based on the description.</span>
        <span>‧ They have 1 to 2 minutes to guess as many words as possible before time runs out.</span>
        <div class="title">Scoring</div>
        <span>‧ The team earns 1 point for each correct guess within the time limit.</span>
        <span>‧ No points are awarded for incorrect guesses or skipped words.</span>
        <span>‧ Rotate turns between teams until a set score is reached or time runs out.</span>`
        
    }, 
    {name: "Other", id: "other", 
        howto: `<div class="title">It's up to you to decide what to play this round.</div>`}
]

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
            openModal("Silly goose!", 
                "There isn't anything to input.", 
                null, () => {})
        }
        updateteamlist();
    }

    nameinput.addEventListener('keyup', event => {
        if (event.keyCode === 13) {
            createteam()
        }
    });

    addbutton.addEventListener("click", (e) => {
        createteam()
    });

    finishbutton.addEventListener("click", (e) => {
        if(teams.length == 0){
            openModal("Silly goose!", 
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
    removeAllAndHide(teamPageDiv);
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
                openModal("Warning!", 
                `The word you are attempting to add is already included in the word-bank. Are you sure you want to add a duplicate word?: ${wordinput.value}`, 
                () => {addWord()}, () => {failedWord()})
            }
            else{addWord()}
        }
        else{
            openModal("Silly goose!", 
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
            openModal("Silly goose!", 
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
        removeAll(wordInputPage);

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
                wordText.append(document.createTextNode("OUT OF WORDS"))
                console.log("OUT OF WORDS");
                
                currentTeam.currentTime = globaltime;
                
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
            timerElement.style.marginLeft = "auto";
            buttonBox.append(timerElement);

            const timer = new easytimer.Timer();
            timerElement.innerHTML = timer.getTimeValues().toString();
            timer.addEventListener('secondTenthsUpdated', (e) => {
                timerElement.innerHTML = timer.getTimeValues().toString(['minutes', 'seconds', 'secondTenths']);
                globaltime = timer.getTimeValues();
            });

            if(currentTeam.currentTime < 1){
                currentTeam.currentTime = 0
            }

            const handleTargetAchieved = () => {
                timer.stop();
                currentTeam.currentTime = maxtime;
                nextTeam();
                textpopup("Time's Up", 2000)
            }
            
            timer.removeEventListener('targetAchieved', handleTargetAchieved);
            timer.addEventListener('targetAchieved', handleTargetAchieved);

            timer.start({precision: 'secondTenths', countdown: true, startValues: {seconds: currentTeam.currentTime}, target:{seconds:0}});
        }

        const stopALLtime = () => {
            //FIX
        }

        const updateScore = () => {
            removeAll(scoreBox);
            scoreBox.append(currentTeam.score);
        }

        let testint = 0;
        const nextTeam = () => {
            // console.log("PREV TEAM");
            // console.log(currentTeamIndex);
            // console.log(currentTeam);
            console.log(testint);
            testint++;
            
            currentTeamIndex = (currentTeamIndex + 1) % teams.length;
            currentTeam = teams[currentTeamIndex];

            // console.log("NEXT TEAM");
            // console.log(currentTeamIndex);
            // console.log(currentTeam);
            
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


const openModal = (header, text, confirmAct, cancelAct) => {
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