        const divs = []

        const setMouse = (x, y, w, h) => {

            const xper = (x / w) - 1
            const yper = (y / h) - 1

           
            divs.forEach(element =>{
                element.style.left = `${xper * (element.offsetWidth-w)}px`
                element.style.top = `${yper * (element.offsetHeight-h)}px`
            
            })

        }
        
        const startup = () => {
            divs.push(document.getElementById("px_1"))
            divs.push(document.getElementById("px_2"))
            divs.push(document.getElementById("px_3"))
            divs.push(document.getElementById("px_4"))
            divs.push(document.getElementById("px_5"))
            const m = document.getElementById("mousecapture")
            m.onmousemove = e => setMouse(e.offsetX, e.offsetY, e.target.offsetWidth, e.target.offsetHeight)
            setMouse(m.offsetWidth / 2, m.offsetHeight / 2, m.offsetWidth, m.offsetHeight)
        }

// let root = document.documentElement;

// root.addEventListener("mousemove", e => {
//     let parallaxcont = document.querySelector('#parallaxcont');


//     var x = e.clientX - (root.offsetWidth * 0.10) - (0.5 * parallaxcont.offsetWidth);
//     var y = e.clientY - (root.offsetHeight * 0.15) - (0.5 * parallaxcont.offsetHeight);
//     parallaxcont.style.setProperty('--mouse-x', x + "px");
//     parallaxcont.style.setProperty('--mouse-y', y + "px");
//     console.log({ x, y });
// });



const sitestartup = () => {
    get_random_image()
    startup()
    setInterval(() => {
            get_random_image()
    }, 2000);
}





image_array = [
    '1.jpeg',
    '2.jpg',
    '3.jpg',
    '4.jpg',
    '5.jpg',
    '6.jpg'
]

function get_random_image() {
    random_index = Math.floor(Math.random() * image_array.length);
    selected_image = image_array[random_index]
    document.getElementById('randomimage').src = `./rndimgs/${selected_image}`
}