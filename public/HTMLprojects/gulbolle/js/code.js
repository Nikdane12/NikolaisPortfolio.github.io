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

const remainingWordsDisp = document.createElement("div");
remainingWordsDisp.classList.add("remainingWordsDisp");


// Settings Variables !!!

let prefsarray = [];

let theme = localStorage.getItem('GulbolleTheme');
if (theme !== null) prefsarray.push('GulbolleTheme');
else theme = null;

let maxtime = localStorage.getItem('maxtime');
if (maxtime !== null) prefsarray.push('maxtime');
else maxtime = 60;

let wordsPerPerson = localStorage.getItem('wordsPerPerson');
if (wordsPerPerson !== null) prefsarray.push('wordsPerPerson');
else wordsPerPerson = 5;

let minusForPass = localStorage.getItem('minusForPass');
if (minusForPass !== null) prefsarray.push('minusForPass');
else minusForPass = false;

let saveprefs = localStorage.getItem('saveprefs');
if (saveprefs !== null) prefsarray.push('saveprefs');
else saveprefs = false;

// ______________

let teams = []
let wordBank = []
let usedWords = []
let passedWords = []
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

const startButtonsCont = document.createElement('div');
startButtonsCont.classList.add("startButtonsCont");
const startButton = createButton(document.createTextNode("Start"));
startButtonsCont.append(startButton);
const optionsButton = createButton(document.createTextNode("Options"));
startButtonsCont.append(optionsButton);
const modeSelectButton = createButton(document.createTextNode("Gamemodes"));
startButtonsCont.append(modeSelectButton);
startPage.append(startButtonsCont);

startButton.addEventListener("click", (e) => { createTeamPage(); });
optionsButton.addEventListener("click", (e) => { openOptions(); });
modeSelectButton.addEventListener("click", (e) => { openGamemodes(); });


const instructs = document.createElement('div');
instructs.style.gridArea = "instructs";
instructs.innerHTML = `<h1>How to Play Gulbolle</h1><ol><li><strong>Create Teams:</strong><p>Divide the players into teams. Each team should choose a team name.</p></li><li><strong>Create a Word Pool:</strong><p>Each player contributes a set number of words to the word pool. The number of words per player can be decided collectively.</p></li><li><strong>Playing the Game:</strong><p>The game consists of multiple rounds, each with the same basic premise:</p><ul><li>In each round, one team selects an actor, while the rest of the team members are guessers.</li><li>The actor has a limited amount of time to help their teammates guess as many correct words from the word pool as possible.</li><li>When time runs out, the next team takes their turn.</li><li>The game continues in this manner until all the words in the word pool have been used.</li></ul></li><li><strong>Winning the Game:</strong><p>The game concludes when all the game modes have been played. The team with the highest score at the end of all rounds is declared the winner.</p></li></ol>`;
startPage.append(instructs);

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
    'apple','orange','banana','dog','cat','sun',/*'moon','tree','book','happy','friend','green','water','run','jump','song','flower','smile','sleep','coffee'*/
];

const randomTeams = [
    "Dog team", "Cat team", "Fish team", "Bear team"
]

const gamemodeList = [
    {name: "CHARADES", id: "char", 
        howto:`<div>How to play Charades...</div><div class="title"> How to Act Out the Word </div><span>‧ A player from the active team gets a word or phrase (without showing it).</span><span>‧ They act it out silently using gestures and body movements. No talking, sounds, or spelling allowed.</span><div class="title">Guessing</div><span>‧ The acting player's teammates try to guess the word or phrase based on the actions.</span><span>‧ They have limited time to guess correctly before time runs out.</span><div class="title">Scoring</div><span>‧ The team earns 1 point for each correct guess within the time limit.</span><span>‧ No points are awarded for incorrect guesses or skipped words.</span><span>‧ Rotate turns between teams until a set score is reached or time runs out.</span>`
    }, 
    // {name: "ALIAS", id: "alias", 
    //     howto: `<div>How to play Alias...</div><div class="title">How to Describe the Word</div><span>‧ A player from the active team picks a word (without showing it).</span><span>‧ They describe the word using synonyms, explanations, or clues, but cannot say the word itself or use direct translations.</span><div class="title">Guessing</div><span>‧ The acting player's teammates try to guess the word based on the description.</span><span>‧ They have limited time to guess correctly before time runs out.</span><div class="title">Scoring</div><span>‧ The team earns 1 point for each correct guess within the time limit.</span><span>‧ No points are awarded for incorrect guesses or skipped words.</span><span>‧ Rotate turns between teams until a set score is reached or time runs out.</span>`
    // }, 
    {name: "TABOO", id: "taboo", 
        howto: `<div>How to play Taboo...</div><div class="title">How to Describe the Word</div><span>‧ A player from the active team picks a card with a target word and a list of forbidden words.</span><span>‧ They describe the target word to their teammates without using the forbidden word.</span><span>‧ They also cannot use gestures, sound effects, or spelling to convey the word.</span><div class="title">Guessing</div><span>‧ They have limited time to guess correctly before time runs out.</span><span>‧ If the player accidentally says a forbidden word, the word gets passed</span><div class="title">Scoring</div><span>‧ The team earns 1 point for each correct guess within the time limit.</span><span>‧ No points are awarded for incorrect guesses or skipped words.</span><span>‧ Rotate turns between teams until a set score is reached or time runs out.</span>`
    }, 
    {name: "TABOO: 1 WORD", id: "taboo", 
        howto: `<div>How to play Taboo: 1 Word...</div><div class="title">How to Describe the Word</div><span>‧ A player from the active team picks a card with a target word and a list of forbidden words.</span><span>‧They describe the target word to their teammates using only a single word that is not a forbidden word.</span><span>‧ They also cannot use gestures, sound effects, or spelling to convey the word.</span><div class="title">Guessing</div><span>‧ They have limited time to guess correctly before time runs out.</span><span>‧ If the player accidentally says a forbidden word, the word gets passed</span><div class="title">Scoring</div><span>‧ The team earns 1 point for each correct guess within the time limit.</span><span>‧ No points are awarded for incorrect guesses or skipped words.</span><span>‧ Rotate turns between teams until a set score is reached or time runs out.</span>`
    },   
    {name: "PICTIONARY", id: "pict", 
        howto: `<div>How to play Pictionary...</div><div class="title">Setup</div><span>‧ Divide players into two or more teams. Each team takes turns drawing and guessing.</span><span>‧ Prepare a set of words or phrases to be drawn, either using a game deck or custom list.</span><span>‧ Provide a drawing surface (paper, whiteboard, or digital) and a timer.</span><div class="title">How to Play</div><span>‧ A player from the active team draws a word or phrase from the word bank.</span><span>‧ Without speaking, writing letters, or using gestures, the player must draw clues to represent the word or phrase.</span><span>‧ The teammates must guess the word or phrase within the time limit based on the drawing.</span><div class="title">Guessing</div><span>‧ Teammates can shout out as many guesses as they like within the time limit.</span><span>‧ The drawer cannot provide verbal hints, spell, or use non-drawing actions to aid guessing.</span><div class="title">Scoring</div><span>‧ The team earns 1 point for each correct guess before the timer runs out.</span><span>‧ No points are awarded if the team fails to guess correctly in time.</span><span>‧ Rotate turns between teams, and continue until a set score is reached or all words are used.</span>`
    }
    
]
let gamemodes = localStorage.getItem('gamemodes');
if (gamemodes !== null) {gamemodes = JSON.parse(gamemodes);prefsarray.push('gamemodes')}
else gamemodes = [gamemodeList[0], gamemodeList[1], gamemodeList[2]];

let unusedGamemodes = gamemodeList.filter(element => 
    !gamemodes.some(mode => mode.name === element.name)
);

let currentMode = 0;
randomWords.forEach(element => {
    wordBank.push(element)
});

const createTeamPage = () => {
    randomTeams.forEach((e, i) => {
        const newteam = new team(e, colors[getWrappedIndex(colors, i)], undefined, undefined, undefined, undefined);
        teams.push(newteam);
    })

    removeAllAndHide(startPage);

    const teamscont = document.createElement("div");
    teamscont.classList.add("teamscont");
    const inputcont = document.createElement("div");
    inputcont.classList.add("inputcont");
    const nameinput = document.createElement("input");
    nameinput.type = "text";
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

            const removeButton = document.createElement("button");
            removeButton.textContent = "X";
            removeButton.classList.add("remove");
            removeButton.style.marginLeft = "auto";

            removeButton.addEventListener("click", () => {
                teams.splice(i, 1);
                updateteamlist();
            });

            teamdiv.append(removeButton);
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
    const addbutton = createButton(document.createTextNode("Add Word"));
    const nextbutton = createButton(document.createTextNode("Next"));
    const finishbutton = createButton(document.createTextNode("Finish"));

    const clarificationMessage = document.createElement("div");
    clarificationMessage.classList.add("clarification-message");
    clarificationMessage.innerHTML = `
        <p><strong>How to input words:</strong></p>    
        <ul>
            <li>Type a word in the input box, then click the <strong>Add Word</strong> button to add it to the list.</li>
            <li>When you're done adding words, press <strong>Next</strong> to pass it to the next person.</li>
            <li>Once everyone has added their words, click <strong>Finish</strong> to proceed.</li>
        </ul>`;

    inputcont.append(wordinput);
    inputcont.append(addbutton);
    inputcont.append(nextbutton);
    inputcont.append(finishbutton);
    wordInputPage.append(inputcont);
    wordInputPage.append(wordscont);
    wordInputPage.append(clarificationMessage);
    document.body.append(wordInputPage)

    const updateNextButtonState = () => {
        nextbutton.disabled = wordscont.children.length === 0 || wordscont.children.length > wordsPerPerson;
    };

    const addtoWordList = word =>{
        const worddiv = document.createElement("div")
        worddiv.classList.add("worddiv");
        worddiv.append(document.createTextNode(word))

        const removeButton = document.createElement("button");
        removeButton.textContent = "X";
        removeButton.classList.add("remove");
        removeButton.style.marginLeft = "auto";

        removeButton.addEventListener("click", () => {
            const wordIndex = wordBank.indexOf(word);
            if (wordIndex !== -1) {wordBank.splice(wordIndex, 1)}
            worddiv.remove();
            updateNextButtonState();
        });

        worddiv.append(removeButton);
        wordscont.append(worddiv);
    }

    const checkWord = () => {
        if(wordinput.value){
            let word = wordinput.value.toLowerCase();

            if (word.trim() === "") {
                openActionModal("Invalid word!", 
                    "The word cannot be just whitespace. Please try again.", 
                    null, () => {});
                return;
            }

            const addWord = () =>{
                if (wordscont.children.length < wordsPerPerson) {
                    wordBank.push(word)
                    addtoWordList(word)
                    console.log("word added", word);

                    wordinput.value = "";
                } else {
                    openActionModal("Word Limit Reached!",
                        `You can only add up to ${wordsPerPerson} words. Please remove some words to add new ones.`,
                        null, () => {});
                }
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
            else{
                addWord()
            }
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
            document.body.append(gamePage);
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
                buttonBox.append(remainingWordsDisp);
                updateRemainingWordsDisp()
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
                textpopup("OUT OF WORDS", 1000, null, (div) => removeSelf(div))
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
                if (minusForPass) {
                    currentTeam.score --;
                    updateScore();
                }
                correctORpass("pass")
            });

            const minusButton = createButton(document.createTextNode("Mistake"))
            buttonBox.append(minusButton);

            minusButton.addEventListener("click", (e) => {
                currentTeam.score --;
                updateScore();
            });

            const pauseButton = createButton(document.createTextNode("Pause"))
            buttonBox.append(pauseButton);

            pauseButton.addEventListener("click", (e) => {
                textpopup("⏸", null, "pause", 
                    (div) => {
                        removeSelf(div);
                        timerarr.forEach(timer => {
                            timer.start();
                        });
                    },
                )
                timerarr.forEach(timer => {
                    timer.pause();
                });
            });

            gamePage.append(buttonBox);
        }

        const updateRemainingWordsDisp = () => {            
            remainingWordsDisp.innerText = `Remaining words: ${wordBank.length - usedWords.length}`
        }

        const resettime = () => {
            console.log("reset time!!!!");
            
            console.log(currentTeam.currentTime);
            
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
                textpopup("Time's Up", 2000, null, (div) => removeSelf(div))
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
                    currentTeam.score ++;
                    currentTeam.correctWords.push(currentWord)
                    useWord(currentWord)
                    if (passedWords.includes(currentWord)) {
                        passedWords.splice(passedWords.indexOf(currentWord), 1);
                    }
                    break;
                case "pass":
                    if(minusForPass){currentTeam.score --;}
                    if(!passedWords.includes(currentWord)){
                        currentTeam.passWords.push(currentWord)
                        passedWords.push(currentWord)
                    }
                    break;
                default:
                    console.log("Error in correct/pass buttons");
                    break;
            }
            updateScore()
            updateRemainingWordsDisp()
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

const handleSavePreference = (key, value, saveEnabled) => {
    prefsarray.push(key)
    if (saveEnabled) {
        localStorage.setItem(key, JSON.stringify(value));
    } else {
        localStorage.removeItem(key);
    }
};

const clearAllPreferences = () => {
    prefsarray.forEach(element => {
        localStorage.removeItem(element);
    });
};

const openOptions = () => {
    
    const optionItem = (itemText, inputType, inputValue, inputAttributes, inputCallback) => {
        const item = document.createElement('div');
        const label = document.createElement('span');
        const input = document.createElement('input');
    
        label.textContent = itemText;
    
        input.type = inputType;
        if (inputType === 'checkbox') {
            input.checked = inputValue;
        } else {
            input.value = inputValue;
        }    
        if (inputAttributes) {
            for (const [attr, value] of Object.entries(inputAttributes)) {
                input.setAttribute(attr, value);
            }
        }
        if (inputCallback) {
            input.addEventListener('input', inputCallback);
        }
    
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.marginBottom = '10px';
    
        item.append(label, input);
        return item;
    };
    
    const { modalBACK, modal } = openOptionModal("Options");
    
    const maxtimeOpt = optionItem(
        "Guess Time (seconds):",
        "number",
        maxtime, 
        { min: 1, max: 300 },
        (e) => {
            maxtime = e.target.value;
            handleSavePreference('maxtime', maxtime, saveprefs);
        }
    );
    
    const wordsPPOpt = optionItem(
        "Word input per person:",
        "number",
        wordsPerPerson, 
        { min: 1, max: 20 },
        (e) => {
            wordsPerPerson = e.target.value;
            handleSavePreference('wordsPerPerson', wordsPerPerson, saveprefs);
        }
    );
    
    const minusPassOpt = optionItem(
        "Pass counts as minus:",
        "checkbox",
        minusForPass, 
        {},
        (e) => {
            minusForPass = e.target.checked;
            handleSavePreference('minusForPass', minusForPass, saveprefs);
        }
    );
    
    const saveprefsOpt = optionItem(
        "Save Preferences:",
        "checkbox",
        saveprefs, 
        {},
        (e) => {
            saveprefs = e.target.checked;            
            handleSavePreference('saveprefs', saveprefs, saveprefs);
            if(!saveprefs){clearAllPreferences()}
        }
    );
    modal.append(maxtimeOpt, wordsPPOpt, minusPassOpt, saveprefsOpt);    
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

        renderSecondaryItems();
        handleSavePreference('gamemodes', gamemodes, saveprefs);
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
            }
        }
    });
    secondaryContainer.addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON" && event.target.classList.contains("add")) {
            const index = parseInt(event.target.getAttribute("data-index"), 10);
            // Add unused game mode to primary list
            gamemodes.push(unusedGamemodes.splice(index, 1)[0]);
            renderItems();
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
    contianer.append(primaryContainer);
    contianer.append(divider)
    contianer.append(secondaryContainer);
    contianer.append(addCustomButton);
    
    modal.append(contianer);
}


let lastWord = null;
const getRandomUnusedWord = () => {
    let randomWord;
    if (usedWords.length !== wordBank.length) {
        let remainingWords = wordBank.filter(word => !usedWords.includes(word));
        if (remainingWords.length === 1 && remainingWords[0] === lastWord) {
            return null; 
        }
        do {
            randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
        } while (randomWord === lastWord); 
        lastWord = randomWord; 
        return randomWord;
    } 
    else if (passedWords.length > 0) {
        if (passedWords.length === 1 && passedWords[0] === lastWord) {
            return null; 
        }
        do {
            randomWord = passedWords[Math.floor(Math.random() * passedWords.length)];
        } while (randomWord === lastWord); 
        lastWord = randomWord;
        return randomWord;
    } 
    else {
        return null;
    }
};

const useWord = (word) => {
    usedWords.push(word);
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
        const handleEscapeKey = (e) => {
            if (e.key === "Escape") {
                removeSelf([modalBACK]);
                cancelAct();
                document.removeEventListener('keydown', handleEscapeKey);
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
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
    if (Array.isArray(input)) {
        input.forEach(element => {
            element.remove();
        });
    }
    else if (input.parentNode) {input.remove();}  
}

const removeAll = div => {
    while(div.firstChild){div.removeChild(div.firstChild)};
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

const textpopup = (text, fadetime, classlist, clickevent) => {
    const div = document.createElement("div");
    div.classList.add("textpopup");
    div.classList.add(classlist);
    div.append(document.createTextNode(text));
    document.body.append(div);

    if(fadetime){setInterval(() => {removeSelf(div)}, fadetime);}
    div.addEventListener('click', (e) => clickevent(div));
}

/* 
THINGS TO FIX

[x] "OUT OF WORDS" not removing
[x] Timer not stopping
[ ] fix bounce anim
[x] popup clickthrough
[x] rnd teams get old maxtime
[x] remove default teams
[ ] words in temp list before next

THINGS TO IMPLEMENT

[ ] list games on frontpage
[x] pass word is 0 or -1?
[x] PAUSE button
[x] instructs up front
[ ] "X" words added
[ ] total words in list
[ ] teams/words page title
[x] words per person input
[x] choose game order/selection
[ ] clarify how add teams works
[x] clarify how add words works
[x] remove teams/words
[ ] peak at words
[x] in-game word count (words left)
[x] save prefs/data
[ ] quit/restart
[ ] home button
[ ] skip game
[ ] button make fun name
[x] swap font 

________

[x] mistake button
[x] Is there a code so that if you pass a word, 
then you won’t get it back that round? 
(Unless if there are no more words left, of course)

*/