// window.onbeforeunload = function () {
//     return "Data will be lost if you leave the page, are you sure?";
// };

let questioncont
let questioninputs
let answerinputs
let quizbody
let actualquiz
let actualquizA
let scorediv 
let totalquestions = 0
let usercorrectanswers = 0
let multipleanswers
let questionarray = []

const startup = () => {
    questioncont = document.getElementById('questioncont')
    questioninputs = document.getElementsByClassName('question')
    answerinputs = document.getElementsByClassName('answer')
    quizbody = document.getElementById('quizbody')
    actualquiz = document.getElementById('actualquiz')
    actualquizA = document.getElementsByClassName('actualquizA')
    scorediv = document.getElementById('score')
    addquestion()
}

const addquestion = () => {
    totalquestions++
    const newquestion = document.createElement('div')
    newquestion.classList.add('questioninnercont')
    questioncont.appendChild(newquestion)
    newquestion.innerHTML = `${totalquestions}.
        <input type="text" class="question" placeholder="Question">
        <input type="text" class="answer" placeholder="Possible answers">
    </div>`
}

const submit = () => {
    for (var i = 0; i <= totalquestions - 1; i++) {
        let oldmultipleanswers = answerinputs[i].value.split(",");
        oldmultipleanswers = oldmultipleanswers.map(value => value.trim());
        let multipleanswers = oldmultipleanswers.reduce((acc, curr, index) => {
            acc[index] = curr;
            return acc;
        }, {});
        questionarray.push({ q: questioninputs[i].value, a: multipleanswers })
        actualquiz.innerHTML += `<div>${i + 1}.
    ${questionarray[i].q}
    <input class="actualquizA"></div>
    `
    }
    quizbody.style.display = `block`
}

const check = () => {
    for (var i = 0; i <= totalquestions - 1; i++) {
        let match = Object.entries(questionarray[i].a).some(([key, value]) => {
            return actualquizA[i].value === value
            // console.log(questionarray.some(item => item.q === value));
            // return questionarray.some(item => item.q === value);
        })
        if (match) {
            actualquizA[i].style.boxShadow = `0px 0px 0px 5px rgb(0, 200, 0)`
            usercorrectanswers++
        }
        else {
            actualquizA[i].style.boxShadow = `0px 0px 0px 5px red`
        }
    }
    scorediv.innerHTML = `Score: ${(usercorrectanswers/totalquestions)*100}%`
    console.log( `Score: ${(usercorrectanswers/totalquestions)*100}%`);
    if (usercorrectanswers === totalquestions) {
        startConfetti()
        setTimeout(() => { stopConfetti() }, 2000)
    }
    usercorrectanswers = 0
}



// const startquiz = () => {
//     const quizpage = document.createElement('div')
//     quizpage.classList.add('quizpage')
//     for(var i = 0; i < totalquestions; i++){
//         quizpage.appendChild()
//     }
// }