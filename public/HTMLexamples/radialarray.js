const main = () => {
    const cont = document.getElementById('cont')

    const slider = document.getElementById("slider")
    const output = document.getElementById("output")
    // const rotate = document.getElementById("rotate")
    const distance = document.getElementById("distance")
    const distanceoutput = document.getElementById("distanceoutput")
    const rotatefixer = document.getElementById("rotatefixer")
    const prev = document.getElementById("prev")
    const next = document.getElementById("next")

    let defaul = 3
    let pos = 0

    const updateCircle = () => {
        output.innerHTML = slider.value
        distanceoutput.innerHTML = distance.value - 1
        remove()
        makeObjs(slider.value)
        if (rotatefixer.checked) {
            fixTheRotation(360)
        }
        else {
            fixTheRotation(1)
        }
        const rotater = pos * 360 / cont.childElementCount
        cont.style.transform = `rotate(${rotater}deg)`
    }

    prev.onclick = () => {
        pos += -1
        updateCircle()
    }
    next.onclick = () => {
        pos += 1
        updateCircle()
    }

    slider.oninput = updateCircle
    // rotate.oninput = updateCircle
    distance.oninput = updateCircle


    const makeObjs = (x) => {
        let rotator = 360 / x
        for (var i = 0; i < x; ++i) {
            const objCont = document.createElement('div')
            objCont.classList.add('objcont')
            const obj = document.createElement('div')
            obj.classList.add('obj')
            const number = document.createTextNode(`${i + 1}`)
            obj.appendChild(number)
            objCont.appendChild(obj)
            cont.appendChild(objCont)

            objCont.style.transform = `rotate(${-i * rotator}deg) translatey(${-distance.value * 30}px)`
        }

    }
    const remove = () => {
        while (cont.hasChildNodes()) {
            cont.removeChild(cont.firstChild)
        }
    }
    const fixTheRotation = (y) => {
        const x = document.getElementsByClassName('obj')
        let rotator = y / x.length
        for (var i = 0; i < x.length; ++i)
            x[i].style.transform = `rotate(${i * rotator}deg)`
    }

    
    rotatefixer.onchange = () => {
        if (rotatefixer.checked) {
            fixTheRotation(360)
        }
        else {
            fixTheRotation(1)
        }
    }


    output.innerHTML = slider.value
    distanceoutput.innerHTML = distance.value - 1

    makeObjs(slider.value)
    if (rotatefixer.checked) {
        fixTheRotation(360)
    }
}