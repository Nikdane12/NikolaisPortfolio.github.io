let inputcont
, buttoncont
, nameinputs
, ageinputs
, output
, backbutton
, infooutput
, youngestArray
, youngestnum
, oldestnum
, average
, totalpeople = 0
, peopleArray = []
, toggled = false
, startedordering = true
, wrong = []

const toggle = () => {
    toggled = !toggled
}

const startup = () => {
    inputcont = document.getElementById('inputcont')
    buttoncont = document.getElementById('buttoncont')
    nameinputs = document.getElementsByClassName('nameinputs')
    ageinputs = document.getElementsByClassName('ageinputs')
    output = document.getElementById('output')
    backbutton = document.getElementById('back')
    infooutput = document.getElementById('info')
    addquestion()
}

const addquestion = () => {
    totalpeople++
    const newperson = document.createElement('div')
    newperson.classList.add('questioninnercont')
    inputcont.appendChild(newperson)
    newperson.innerHTML = `<div>
        <input type="text" class="nameinputs" placeholder="Navn">
        <input type="number" class="ageinputs" placeholder="Alder">
    </div>`
}

const submit = () => {
    peopleArray = []
    wrong = []
    for (var i = 0; i <= totalpeople - 1; i++) { 
        if (ageinputs[i].checkValidity()) {
            // console.log('passed');
            peopleArray.push({ n: nameinputs[i].value, a: ageinputs[i].value })
            ageinputs[i].style = ""
            wrong.push(0)
        }
        else {
            // console.log('didnt pass');
            wrong.push(1)
            ageinputs[i].style = "border: 2px solid red"
            alert('Please input ONLY numbers in the age input')
        }
    }
    if(wrong.every(element => element === wrong[0])){
        calcinfo()  
        resetOutput()
    }
}

const resetOutput = () => {
    output.innerHTML = `
    <tr>
        <th>Navn</th>
        <th onclick="order()">Alder ${toggled ? '▼ ' : '▲ ' }</th>
    </tr>`
    for (var i = 0; i < peopleArray.length; i++) {  
        output.innerHTML += `
        <tr>
            <td>${peopleArray[i].n}</td><td>${peopleArray[i].a}</td>
        </tr>
        `
    }
    if (wrong.every(element => element === wrong[0])) {
        infooutput.innerHTML = `Yngst person: ${youngestnum}<br>Eldst person: ${oldestnum}<br>Gjennomsnittalder: ${average}`
        output.style = "display: ;"
        inputcont.style = "display: none;"
        buttoncont.style = "display: none;"
        backbutton.style = "display: block;"
    }
}

const calcinfo = () => {
    youngestArray = [...peopleArray]
    youngestArray.sort((a, b) => a.a - b.a); 
    youngestnum = youngestArray[0].a
    oldestnum = youngestArray.reverse()[0].a
    let sum = 0;
    youngestArray.forEach(num => sum += Number(num.a));
    average = (sum / youngestArray.length).toFixed(1);
}

const order = () => {
    toggle()
    if(startedordering){
        peopleArray.sort((a, b) => a.a - b.a);
        startedordering = false
    }
    else{
        peopleArray.reverse()
    }
    resetOutput()
}

const back = () => {
    output.style = "display: none;"
    inputcont.style = "display: ;"
    buttoncont.style = "display: ;"
    backbutton.style = "display: none;"
    infooutput.innerHTML = ""

}

const reset = () => {
    peopleArray = []
    startedordering = true
    inputcont.innerHTML = `<div class="button right" onclick="reset()" tabindex="0">Reset</div>
    `
    const newperson = document.createElement('div')
    newperson.classList.add('questioninnercont')
    inputcont.appendChild(newperson)
    newperson.innerHTML = `<div>
        <input type="text" class="nameinputs" placeholder="Navn">
        <input type="number" class="ageinputs" placeholder="Alder">
    </div>`
}