let slider
let carousel
let mousecapture
let newvalue = 0

const startup = () => {
    slider = document.getElementById('slider')
    carousel = document.getElementById('carousel')
    mousecapture = document.getElementById('mousecapture')
    mousecapture.addEventListener('mousemove', MouseMove)
    // slider.oninput = move
}

let oldvalue = 0
const MouseMove = (e) =>{
    slider.style.transform = 'translate(' + e.pageX + 'px, ' + e.pageY + 'px)'
    slider.onmousedown = () => {
        mousecapture.removeEventListener('mousemove', MouseMove)
        let maxright = carousel.getBoundingClientRect().right - document.documentElement.clientWidth + 100
        let maxleft = carousel.getBoundingClientRect().left - 100
        slider.oninput = () => {
            newvalue = (Number(slider.value) - 250) * 2.5
            carousel.style.transform = 'translateX(' + Number(newvalue + oldvalue) + 'px)'
        }
    }
    slider.onmouseup = () => {mousecapture.addEventListener('mousemove', MouseMove)
        oldvalue += newvalue
        
    }
}