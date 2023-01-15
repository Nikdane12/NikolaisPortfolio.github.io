// window.onbeforeunload = function () {
//     return "Data will be lost if you leave the page, are you sure?";
// };

// {question, answers: [{isRight, answer}]}

// TRY '...' to combine objects 

let questioncont
let questioninputs
let answerinputs
let actualquizQ
let actualquizA
let checkbox
let totalquestions = 1
let questionarray = {}

const startup = () => {
    questioncont = document.getElementById('questioncont')
    questioninputs = document.getElementsByClassName('question')
    answerinputs = document.getElementsByClassName('answer')
    actualquiz = document.getElementById('actualquiz')
    actualquizA = document.getElementsByClassName('actualquizA')
    checkbox = document.getElementsByClassName('correctanswercheck')
}

const addquestion = () => {
    totalquestions++
    const newquestion = document.createElement('div')
    newquestion.classList.add('questioninnercont')
    questioncont.appendChild(newquestion)
    newquestion.innerHTML = `${totalquestions}.
        <input type="text" class="question" placeholder="Question">
        <input type="text" class="answer" placeholder="Answer">`
}

const submit = () => {
    for (var i = 0; i <= totalquestions - 1; i++) {
        questionarray["Question" + i] = {q: questioninputs[i].value};
        console.log(questionarray["Question" + i]);
        console.log('q:', i, questionarray["Question" + i].q);
    //     actualquiz.innerHTML += `
    // <div class="actualquizQ">${questionarray[i].q}</div>
    // <input class="actualquizA">`
    }
    console.log(questionarray);
    questionarray["Question" + i] = {righta: 1, a1: answerinputs[0].value, a2: answerinputs[1].value, a3: answerinputs[2].value, a4: answerinputs[3].value }

    for (var x = 0; x < answerinputs.length; x++) {
        if (checkbox[x].checked) {
            questionarray["Question" + i].righta = answerinputs[x].value
        }
        console.log(questionarray);
    }

}

const check = () => {
    for (var i = 0; i <= totalquestions - 1; i++) {
        if (actualquizA[i].value != questionarray[i].a) {
            actualquizA[i].style.border = `2px solid red`
        }
        else {
            actualquizA[i].style.border = `2px solid green`

        }
    }
}



// const startquiz = () => {
//     const quizpage = document.createElement('div')
//     quizpage.classList.add('quizpage')
//     for(var i = 0; i < totalquestions; i++){
//         quizpage.appendChild()
//     }
// }