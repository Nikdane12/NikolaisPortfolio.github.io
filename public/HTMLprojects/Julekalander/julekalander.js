

let calender
let daysarray
let dayobj
let day
let lockbutton
let unlockstatus
let currentdate = new Date()


const startup = () => {
    lockbutton = document.getElementById('unlock')
    unlockstatus = localStorage.getItem('kalanderlockstatus') ?? 'lock'
    if (unlockstatus == 'unlock') {
        lockbutton.innerHTML = `🔓`
    }
    else {
        lockbutton.innerHTML = `🔒`
    }
    daysarray = JSON.parse(localStorage.getItem('daysarray')) ?? []

    if (daysarray.length < 1) { createDays() }
    calender = document.getElementById('calender')

    for (var i = 0; i < 24; ++i) {
        const day = daysarray.find(x => x.position == i)
        const daycont = document.createElement('div')
        daycont.classList.add('daycont')
        daycont.setAttribute('id', day.day)
        let myanim = ''
        if (day.openstatus) { myanim = `origin${day.direction} ${day.direction} black` }
        let takeTreat = ''
        if (day.takenstatus) { takeTreat = 'taken' }
        let display = ''
        if (!day.openstatus) { display = 'hide' }
        daycont.innerHTML = `
        <div class="daybackground ${display}"></div>
        <img class="treat ${takeTreat} ${display}" src="/HTMLprojects/Julekalander/${day.treat}.png" onclick="eatTreat(${day.day})"/>
        <div class="day ${myanim}" onclick="openDoor(${day.day})">${day.day}</div>`
        calender.appendChild(daycont)
    }


}

const createDays = () => {
    let shufflednumbers = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23])
    for (var i = 0; i < 24; ++i) {
        dayobj = {
            day: i + 1,
            direction: getRandomDirection(),
            treat: getRandomTreat(),
            takenstatus: false,
            position: shufflednumbers[i],
            openstatus: false,
        }
        daysarray.push(dayobj)
    }
    let Julenatt = daysarray.find(x => x.day == 24)
    Julenatt.treat = 'julenatt'
    saveLocalStorage()
}

const saveLocalStorage = () => {
    localStorage.setItem('daysarray', JSON.stringify(daysarray))
    localStorage.setItem('kalanderlockstatus', unlockstatus)
}

const getRandomDirection = () => {
    let directions = ['up', 'down', 'left', 'right']
    return directions[Math.floor(Math.random() * directions.length)]
}

const getRandomTreat = () => {
    let treats = ['kjeks', 'sjokolade', 'lakris', 'kakeman']
    return treats[Math.floor(Math.random() * treats.length)]
}

const shuffle = (array) => {
    var i = array.length, j = 0, temp
    while (i--) {
        j = Math.floor(Math.random() * (i + 1))
        temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array
}

const eatTreat = (day) => {
    let lsdknc = daysarray.find(x => x.day == day)
    lsdknc.takenstatus = true
    const daycont = document.getElementById(day)
    const image = daycont.querySelector('.treat')
    image.classList.add('taken')

    saveLocalStorage()
}

const unlock = () => {
    unlockstatus = unlockstatus == 'unlock' ? 'lock' : 'unlock'
    if (unlockstatus == 'unlock') {
        lockbutton.innerHTML = `🔓`
    }
    else {
        lockbutton.innerHTML = `🔒`
    }
    saveLocalStorage()
}

const openDoor = (day) => {
    if (unlockstatus == 'lock') {
        if (day > currentdate.getDate()) {
        }
        else {
            actuallyopeningday(day)
        }
    }
    else {
        actuallyopeningday(day)
    }
}

const actuallyopeningday = (day) => {
    let newthing = daysarray.find(x => x.day == day)
    const daycont = document.getElementById(day)
    const cover = daycont.querySelector('.day')        
    const treatimage = daycont.querySelector('.treat')
    const background = daycont.querySelector('.daybackground')

    if (newthing.openstatus) {
        cover.classList.remove(newthing.direction)
        cover.classList.remove('black')
        treatimage.classList.add('hide')
        background.classList.add('hide')
        newthing.openstatus = false
    }
    else {    
        newthing.openstatus = true     
        cover.classList.add(newthing.direction)
        cover.classList.add(`origin${newthing.direction}`)
        cover.classList.add('black')
        treatimage.classList.remove('hide')
        background.classList.remove('hide')
    }

    saveLocalStorage()
}



const clear2 = () => {
    localStorage.removeItem('daysarray')
    window.location.reload()
}

// let calender
// let days = []
// let daysOpened = []
// let currentdate = new Date()

// const startup = () => {
//     calender = document.getElementById('calender')
//     daysOpened = JSON.parse(localStorage.getItem('daysOpened')) ?? []
//     for (var i = 1; i < 25; ++i) {
//         days.push(i)
//         const daycont = document.createElement('div')
//         daycont.classList.add('daycont')
//         daycont.innerHTML = `<div class="day" onclick="openDay(${i})">${i}</div>`
//         // const dayimage = document.createElement('div')
//         // dayimage.classList.add('dayimage')
//         // daycont.appendChild(dayimage)
//         calender.appendChild(daycont)
//     }
//     renderDays()
//     console.log(currentdate.getDate())
// }

// const renderDays = () => {
//     classday = document.getElementsByClassName('day')
//     for (var x of daysOpened) {
//         classday[x.day].classList.add(x.direction)
//     }
// }

// const getRandomDirection = () => {
//     let directions = ['up', 'down', 'left', 'right']
//     return directions[Math.floor(Math.random()*directions.length)]
// }


// // let garbage = [{id, direction}]

// const openDay = (x) => {
//     if (x > currentdate.getDate()) {
//         alert('Can not open')
//         console.log('cantopen')
//     }
//     else {
//         var newx = x - 1
//         var slkdns = getRandomDirection()
//         daysOpened.push({day:newx, direction:slkdns})
//         localStorage.setItem('daysOpened', JSON.stringify(daysOpened))
//         classday[newx].classList.add(slkdns)
//     }
// }



