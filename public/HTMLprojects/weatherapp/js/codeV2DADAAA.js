// const myWeatherApp = (function () {

// const { default: axios } = require("axios")

let myWeatherData

let currentTheme = localStorage.getItem('theme-weatherapp') ?? 'light'
let currentdate = new Date()
let savedCities = JSON.parse(localStorage.getItem('savedCities')) ?? ['Molde']
let currentCity = localStorage.getItem('currentCity') ?? 'Molde'
let adjustedTime

//  // DAD: I would put this back, currentCity is like any other setting you are keeping, like currentbutton, etc.

let dayHrCont
let currentbutton = localStorage.getItem('weekdaybutton') ?? 'week'
let itemcont
let search
let tempTgl
let newtemp
let newtempmax
let newtempmin

let chart
let chartElement

let tempUnit = localStorage.getItem('tempUnit') ?? 'celsius'

document.documentElement.setAttribute('data-theme', currentTheme) // DAD: it seems that this would not do anything, I wouldnt think the document is loaded yet...

const tgl = () => {
    currentTheme = currentTheme == 'dark' ? 'light' : 'dark'

    document.documentElement.setAttribute('data-theme', currentTheme)
    localStorage.setItem('theme-weatherapp', currentTheme)
}

// THIS IS REALLY IMPORTANT DONT LOSE!!!!
// https://www.visualcrossing.com/resources/documentation/weather-api/timeline-weather-api/
// https://www.visualcrossing.com/resources/documentation/weather-api/unit-groups-and-measurement-units/

// simple 15 day location request
// https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/[LOCATION]]?key=TBQ4PX42CLD6X23U7TXESKSVL

// STRINGS TO ICONS
// https://stackoverflow.com/questions/48926091/convert-an-array-of-string-to-an-array-of-images

const getDayName = (dayIndex) => {
    let daysArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return daysArray[dayIndex]
}

const getMonthName = (monthIndex) => {
    let monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return monthsArray[monthIndex]
}

let iconArray = ['snow', 'rain', 'fog', 'wind', 'cloudy', 'partly-cloudy-day', 'partly-cloudy-night', 'clear-day', 'clear-night']

const getFormatedDate = (x) => {
    return getDayName(x.getDay()) +
        getMonthName(x.getMonth()) +
        x.getFullYear() + " @ " +
        x.getHours() + ":" +
        x.getMinutes() + ":" +
        x.getSeconds()
}

const Delay = ms => new Promise((resolve, reject) => { setTimeout(resolve, ms) })

const getData = async (city) => axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=TBQ4PX42CLD6X23U7TXESKSVL&include=days,hours`)

const startup = async () => {
    dayHrCont = document.getElementById("day-hr-cont")
    itemcont = document.getElementById('w-list-items')
    search = document.getElementById('searchbox')
    tempTgl = document.getElementById('slider-temp')
    chartElement = document.getElementById('chart-cont')

    search.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            if (search.value?.length > 0) {
                savedCities.push(capitalizeFirstLetter(search.value))
                localStorage.setItem('savedCities', JSON.stringify(savedCities))
                search.value = null
                renderCityList()
            }
        }
    })

    renderCityList()
    await updatePage() // DAD: this is async, so you should await it, which means that start should be async, which is just fine
}

const setCurrentCity = async (cityname) => {
    currentCity = cityname
    localStorage.setItem('currentCity', currentCity)
    await updatePage() // DAD: this is async, so you should await it, which means that start should be async, which is just fine, its called from a button and async is fine from there
    closeWlist()
}

const updatePage = async () => { // DAD you could just set currentCity first and then not send it in here
    try {
        myWeatherData = (await getData(currentCity)).data // DAD this would change to currentCity

        textInjector()
        updateDayHrCont()

        await createChart()
    }
    catch (error) {
        alert('City Not Found')
        console.log(error.message);
    }
}

const capitalizeFirstLetter = (x) => {
    return x.charAt(0).toUpperCase() + x.slice(1)
}

const textInjector = () => {
    setLocation(myWeatherData.resolvedAddress)
    setDate(currentdate)
    setTime(currentdate, myWeatherData)
    setTimezone(myWeatherData)
    setSunStuff(myWeatherData)
    setIcon(myWeatherData)
    setMainTemp(myWeatherData)
}

const setLocation = (x) => {
    let locationobj = document.getElementById('location')
    locationobj.innerHTML = `${x.slice(0, x.indexOf(','))}`
}

const setDate = (theDate) => {
    const dateobj = document.getElementById('date')
    dateobj.innerHTML = `${getDayName(theDate.getDay())}`
}

const setTime = (currentdate, weatherdata) => {
    const timeobj = document.getElementById('time')
    timeobj.innerHTML = `${'0' + weatherdata.days[0].hours[calculateCityTime(weatherdata)].datetime}`.slice(1, 3) + ":" +
        `${'0' + currentdate.getMinutes()}`.slice(-2)
}

const setTimezone = (weatherdata) => {
    const timezoneobj = document.getElementById('timezone')
    timezoneobj.innerHTML = `TZ : ${weatherdata.timezone}`
}

const setSunStuff = (data) => {
    let day = data.days[0]
    let rtimes = day.sunrise.split(':').map(x => parseInt(x))
    let stimes = day.sunset.split(':').map(x => parseInt(x))
    let state = rtimes
    let setstate = 'Sunrise'
    let localtime = calculateCityTime(data)
    if (localtime < rtimes[0]) {
        setstate = 'Sunrise'
        state = rtimes
    }
    else if (localtime < stimes[0]) {
        setstate = 'Sunset'
        state = stimes
    }

    const sunobj = document.getElementById('sunrise-set')
    sunobj.innerHTML = `${setstate} ${('0' + state[0]).slice(-2)}:${('0' + state[1]).slice(-2)}`
}

const setIcon = (day) => {
    let iconobj = document.getElementById('w-icon')
    iconobj.innerHTML = `<img src="./weatherapp/img/${day.days[0].hours[calculateCityTime(day)].icon}.svg" onload="SVGInject(this,{makeIdsUnique:false,useCache:false})"/>`
}

const setMainTemp = (day) => {
    let tempobj = document.getElementById('main-temp')
    let tempsymbol
    while (tempobj.hasChildNodes()) {
        tempobj.removeChild(tempobj.firstChild)
    }
    let tempstuff = day.days[0].hours[calculateCityTime(day)].temp
    if (tempUnit == 'farenheit') {
        tempsymbol = 'F'
        tempstuff = farenheitConvert(day.days[0].hours[calculateCityTime(day)].temp).toFixed(0)
    }
    else {
        tempsymbol = 'C'
        tempstuff = (day.days[0].hours[calculateCityTime(day)].temp).toFixed(1)
    }
    tempobj.innerHTML = `${tempstuff}°${tempsymbol}`
}

const openWlist = () => {
    const wList = document.getElementById('w-list')
    wList.style.left = `0px`
}

const closeWlist = () => {
    const wList = document.getElementById('w-list')
    wList.style.left = ``
}

const removeItem = (i) => {
    savedCities.splice(i, 1)
    localStorage.setItem('savedCities', JSON.stringify(savedCities))
    renderCityList()
}

const calculateCityTime = (x) => {
    let cityTimeOS = x.tzoffset
    let UTCTime = currentdate.getUTCHours()

    let cityTime = UTCTime + cityTimeOS
    if (cityTime > 24) {
        cityTime - 24
    }
    return cityTime
}

// const removeItem = (x) => {
//     const index = myList.findIndex(x => x.id == id)
//     if (index > -1) myList.splice(index, 1)
// }

// const myList = [
//     { id: 'a', name: 'AAA' },
//     { id: 'b', name: 'BBB' },
//     { id: 'c', name: 'CCC' },
//     { id: 'd', name: 'DDD' },
// ]
// const rm = id => {
//     const index = myList.findIndex(x => x.id == id)
//     if (index > -1) myList.splice(index, 1)
// }
// const add = (id, name) => { myList.push({ id, name }) }
// rm('b')
// console.log(JSON.stringify(myList))
// add('e', 'EEE')
// console.log(JSON.stringify(myList))
// rm('c')
// console.log(JSON.stringify(myList))

// const addItem = (x, i) => {
//     console.log(i)
//     const city = document.createElement('div')
//     city.classList.add('example-city')
//     city.innerHTML = `<div class="city-name">${x}<span class="city-close" onclick="removeItem(${i})">✖</span></div>`
//     itemcont.appendChild(city)
// }

// const removeItem = (i) => {
//     itemcont.removeChild(itemcont.children[i])
//     savedCities.splice(i, 1)    
//     console.log(savedCities)    
//     localStorage.setItem('savedCities', JSON.stringify(savedCities))
// }

// const addNewItem = () => {
//     search.addEventListener("keypress", (event) => {
//         if (event.key === "Enter") {
//             if (search.value?.length > 0) {
//                 addItem(search.value, cityNumber)
//                 savedCities.push(search.value)
//                 localStorage.setItem('savedCities', JSON.stringify(savedCities))
//                 search.value = null
//                 console.log(savedCities)
//             }
//         }
//     })
// }

const weekButton = () => {
    currentbutton = 'week'
    localStorage.setItem('weekdaybutton', currentbutton)
    updateDayHrCont()
}

const dayButton = () => {
    currentbutton = 'day'
    localStorage.setItem('weekdaybutton', currentbutton)
    updateDayHrCont()
}

const updateDayHrCont = () => {
    removeDaysHrs()
    if (currentbutton == 'week') {
        injectDays()
    }
    else {
        injectHours()
    }
}

const tglTemp = () => { // DAD: just so you know, there is no reference to this here, maybe in the html?
    tempUnit = tempUnit == 'farenheit' ? 'celsius' : 'farenheit'
    localStorage.setItem('tempUnit', tempUnit)
    updateDayHrCont()
    if (tempUnit == 'farenheit') {
        tempTgl.classList.add('special')
    }
    else {
        tempTgl.classList.remove('special')
    }
    setMainTemp(myWeatherData)
}

const isUndefined = x => typeof x == 'undefined'

const getNewTemps = x => {
    var newtemp
    var newtempmax
    var newtempmin

    if (tempUnit == 'farenheit') {
        newtemp = farenheitConvert(x.temp).toFixed(0)
        if (!isUndefined(x.tempmax)) {
            newtempmax = farenheitConvert(x.tempmax).toFixed(0)
            newtempmin = farenheitConvert(x.tempmin).toFixed(0)
        }
    }
    else {
        newtemp = x.temp.toFixed(1)
        if (!isUndefined(x.tempmax)) {
            newtempmax = x.tempmax.toFixed(1)
            newtempmin = x.tempmin.toFixed(1)
        }
    }

    return { newtemp, newtempmax, newtempmin }
}

const farenheitConvert = celsius => celsius * 1.8 + 32

const injectDays = () => {
    for (var i = 0; i < myWeatherData.days.length; ++i) {
        let daydata = myWeatherData.days[i]
        const day = document.createElement('div')
        day.classList.add('day')
        const { newtemp, newtempmax, newtempmin } = getNewTemps(daydata)
        day.innerHTML = `
            <div class="daysday">${getDayName(currentdate.getDay() + i).slice(0, 3)}</div>
            <div class="date">${(daydata.datetime).slice(8, 10)}</div>
            <div class="iconcont"><img src="./weatherapp/img/${daydata.icon}.svg" onload="SVGInject(this,{makeIdsUnique:false,useCache:false})"/></div>
            <div class="avg-temp">${newtemp}°</div>
            <div class="h-l-temp-cont">
                <div class="h-l-temp">max<br>${newtempmax}°</div>
                <div class="h-l-temp">min<br>${newtempmin}°</div>
        `
        dayHrCont.appendChild(day)
    }
}

// make first hour equal to current hour!!!!!!! + next day first hours

let hourdata

const injectHours = () => {
    adjustedTime = parseInt((myWeatherData.days[0].hours[calculateCityTime(myWeatherData)].datetime).slice(0, 2))
    for (var i = 0; i < myWeatherData.days[0].hours.length / 2; ++i) {
        hourdata = myWeatherData.days[0].hours[Math.floor(adjustedTime + i * 2)]
        if (isUndefined(hourdata)) {
            hourdata = myWeatherData.days[1].hours[Math.floor(adjustedTime + i * 2 - 24)]  // stuff*2
        }
        const day = document.createElement('div')
        day.classList.add('day')
        const { newtemp } = getNewTemps(hourdata)
        snowrainstuff = hourdata.precip * 10
        snowrainicon = `<img src="./weatherapp/img/Raindrop.svg" onload="SVGInject(this,{makeIdsUnique:false,useCache:false})"/>`
        if (hourdata.snow > 0) {
            snowrainstuff = hourdata.snow * 10
            snowrainicon = `<img src="./weatherapp/img/Snowflake.svg" onload="SVGInject(this,{makeIdsUnique:false,useCache:false})"/>`
        }
        day.innerHTML = `
            <div class="hour">${(hourdata.datetime).slice(0, 5)}</div>
            <div class="iconcont"><img src="./weatherapp/img/${hourdata.icon}.svg" onload="SVGInject(this,{makeIdsUnique:false,useCache:false})"/></div>
            <div class="avg-temp">${newtemp}°</div>
            <div class="s-r-cont">
                ${snowrainicon}<div class="s-r-stuff">${snowrainstuff}</div>
        `
        dayHrCont.appendChild(day)
    }
}

const renderCityList = () => {
    while (itemcont.hasChildNodes()) {
        itemcont.removeChild(itemcont.firstChild)
    }
    for (var i = 0; i < savedCities.length; ++i) {
        const city = document.createElement('div')
        city.classList.add('example-city')
        city.innerHTML = `<div class="city-name" onclick="setCurrentCity('${savedCities[i]}')">${savedCities[i]}<span class="city-close" onclick="event.stopPropagation(); removeItem(${i})">✖</span></div>`
        itemcont.appendChild(city)
    }
}

const removeDaysHrs = () => {
    while (dayHrCont.hasChildNodes()) {
        dayHrCont.removeChild(dayHrCont.firstChild)
    }
}

// let itemcont = document.getElementById('w-list-items')
// class city {
//     constructor(){    
//         this.city.onclick = () => removeItem(this.city)
//     }
//     removeItem = (x) => {
//         x.remove()
//     }
// }

const openSettings = () => {
    const settingscont = document.getElementById('settings-cont')
    settingscont.style.right = `0px`
}

const closeSettings = () => {
    const settingscont = document.getElementById('settings-cont')
    settingscont.style.right = ``
}



const createChart = async () => {
    let temparr = [];
    let hourarr = [];

    myWeatherData.days[0].hours.forEach((e, i) => {
        temparr.push([adjustedTime + i, e.temp]);
        if (adjustedTime + i < 23) {
            hourarr.push(adjustedTime + i);
        } else {
            hourarr.push(adjustedTime + i - 23);
        }
    });

    console.log(hourarr[0]);



    const options = {
        chart: {
            type: 'line',
            toolbar: {
                show: false,
            },
        },
        series: [{
            name: 'sales',
            data: temparr,
        }],
        xaxis: {
            categories: hourarr,
        },
        tooltip: {
            enabled: false,
        },
    };

    const chart = new ApexCharts(chartElement, options);
    chart.render();
};

// return {startup, openWlist, openSettings, tgl, closeSettings, closeWlist, addItem, setIcon, buttonchanger, weekButton, dayButton}
// })()