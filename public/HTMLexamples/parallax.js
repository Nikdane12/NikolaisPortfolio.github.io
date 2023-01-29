const divs = []

        const setMouse = (x, y, w, h) => {

            const xper = (x / w) - 1
            const yper = (y / h) - 1

            const xoffset = (xper + 0.3)

           
            divs.forEach(element =>{
                element.style.left = `${xoffset * (element.offsetWidth-w)}px`
                element.style.top = `${yper * (element.offsetHeight-h)}px`
            
            })

        }
        
        const startup = () => {
            divs.push(document.getElementById("px_1"))
            divs.push(document.getElementById("px_2"))
            divs.push(document.getElementById("px_3"))
            const m = document.getElementById("mousecapture")
            m.onmousemove = e => setMouse(e.offsetX, e.offsetY, e.target.offsetWidth, e.target.offsetHeight)
            setMouse(m.offsetWidth / 2, m.offsetHeight / 2, m.offsetWidth, m.offsetHeight)
        }

 