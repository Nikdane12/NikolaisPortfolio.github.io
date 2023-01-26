let inputcont
, buttoncont
, nameinputs
, ageinputs
, output
, infooutput
, youngestnum
, oldestnum
, youngestArray
, average
, totalpeople = 0
, peopleArray = []
, toggled = false
, startedordering = true

const toggle = () => {
    toggled = !toggled
}

const startup = () => {
    inputcont = document.getElementById('inputcont')
    buttoncont = document.getElementById('buttoncont')
    nameinputs = document.getElementsByClassName('nameinputs')
    ageinputs = document.getElementsByClassName('ageinputs')
    output = document.getElementById('output')
    infooutput = document.getElementById('info')
    addquestion()
}

const addquestion = () => {
    const newperson = document.createElement('div')
    newperson.classList.add('questioninnercont')
    inputcont.appendChild(newperson)
    newperson.innerHTML = `<div>
        <input type="text" class="nameinputs" placeholder="Navn">
        <input type="number" class="ageinputs" placeholder="Alder">
    </div>`
    resetOutput()
}

const resetOutput = () => {
    output.innerHTML = `
    <tr>
        <th>Navn</th>
        <th onclick="order()">Alder ${toggled ? '▼ ' : '▲ '}</th>
    </tr>`
}

const submit = () => {
    totalpeople++
    if (ageinputs[0].checkValidity()) {
        peopleArray.push({ n: nameinputs[0].value, a: ageinputs[0].value })
        calcinfo()
        infooutput.innerHTML = `Yngst person: ${youngestnum}<br>Eldst person: ${oldestnum}<br>Gjennomsnittalder: ${average}`
        nameinputs[0].value = ""
        ageinputs[0].value = ""
        console.log(peopleArray);
        ageinputs[0].style = ""
    }
    else {
        ageinputs[0].style = "border: 2px solid red"
        alert('Please input ONLY numbers in the age input')
    }
    displayPeople()
}

const displayPeople = () => {
    resetOutput()
    for (var i = 0; i < peopleArray.length; i++) {
         output.innerHTML += `
                <tr>
                    <td>${peopleArray[i].n}</td><td>${peopleArray[i].a}</td>
                </tr>
                `
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
    if (startedordering) {
        peopleArray.sort((a, b) => a.a - b.a);
        startedordering = false
    }
    else {
        peopleArray.reverse()
    }
    displayPeople()
}

const reset = () => {
    peopleArray = []
    resetOutput()
    startedordering = true
    infooutput.innerHTML = ""
}