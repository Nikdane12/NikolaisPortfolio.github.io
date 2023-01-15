let buttoncont
let output
let finalequals
let thing
const startup = () => {
    buttoncont = document.getElementById('button-cont')
    output = document.getElementById('output')
    for (var i = 1; i < 10; ++i) {
        const innerbuttoncont = document.createElement('div')
        innerbuttoncont.classList.add('innerbuttoncont')
        innerbuttoncont.innerHTML = `<div class="numbers" onclick="run(${i})">${i}</div>`
        buttoncont.appendChild(innerbuttoncont)
    }
    const innerbuttoncont = document.createElement('div')
    innerbuttoncont.classList.add('innerbuttoncont')
    innerbuttoncont.innerHTML = `<div class="numbers" onclick="run(0)">0</div>`
    buttoncont.appendChild(innerbuttoncont)
}

const clearstuff = () => {
    output.value = ''
}

const add = () => {
    output.value += '+'
}

const sub = () => {
    output.value += '-'
}

const div = () => {
    output.value += '/'
}

const multi = () => {
    output.value += '*'
}

const run = (i) => {
    output.value += i
}

const equal = () => {
    let y = math.evaluate(output.value)
    output.value = y
}
