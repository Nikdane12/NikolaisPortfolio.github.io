export const removeAll = div => {
    while(div.firstChild){div.removeChild(div.firstChild)};
}

export const delay = X => new Promise((resolve, reject) => { setTimeout(resolve, X) })


export const saveLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
}

export const shuffleArray = (array) => {
    let i = array.length, j = 0, temp
    while (i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}

export const capitalizeFirstLetter = (x) => {
    return x.charAt(0).toUpperCase() + x.slice(1)
}

export const getRandomInRange = (min, max) => Math.floor(Math.random() * (max - min) + min)

export const runFunctionXTimes = (callback, interval, repeatTimes) => {
    let repeated = 0;
    

    const doTask = () => {
        if ( repeated < repeatTimes ) {
            callback()
            repeated += 1
        } else {
            clearInterval(intervalTask)
        }
    }
    const intervalTask = setInterval(doTask, interval)
}