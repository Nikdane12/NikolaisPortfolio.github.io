let slider
let carousel
let newvalue = 0

const startup = () => {
    slider = document.getElementById('slider')
    carousel = document.getElementById('carousel')
    document.addEventListener('mousemove', MouseMove)
    // slider.oninput = move
}

let oldvalue = 0
const MouseMove = (e) =>{
    slider.style.transform = 'translate(' + e.pageX + 'px, ' + e.pageY + 'px)'
    slider.onmousedown = () => {
        document.removeEventListener('mousemove', MouseMove)
        let maxright = carousel.getBoundingClientRect().right - document.documentElement.clientWidth + 100
        let maxleft = carousel.getBoundingClientRect().left - 100
        slider.oninput = () => {
            // if(maxright < 0 || maxleft > 0){
                newvalue = (Number(slider.value) - 250) * 2.5
                carousel.style.transform = 'translateX(' + Number(newvalue + oldvalue) + 'px)'
            // }
            
            
        }
    }
    slider.onmouseup = () => {document.addEventListener('mousemove', MouseMove)
        oldvalue += newvalue
        
    }
}