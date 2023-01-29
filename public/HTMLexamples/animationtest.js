let wrapper = document.getElementById('wrapper')
let columns = 0, rows = 0, toggled = false
const myPath = anime.path('path');
const toggle = () => {
  toggled = !toggled
}


const click = index => {
  toggle()
  if(toggled){
    document.body.classList.add('toggled')
  }
  else{
    document.body.classList.remove('toggled')
  }
  anime({
    targets: '.tile',
    scale: {
      value: toggled ? 0 : 1,
      easing: 'easeInCubic',
      duration: 300
    },
    delay: anime.stagger(50, {
      grid: [columns, rows],
      from: index ?? 0,
    }),
  })
  anime({
    targets: '.textanim',
    opacity: {
      value: toggled ? 1 : 0,
      easing: 'easeInCubic',
      duration: 500
    },
    delay: anime.stagger(1000, { start: 30 * Math.max(columns, rows) }),
  })
  anime({
    targets: '.wordanim',
    opacity: {
      value: toggled ? 1 : 0,
      easing: 'easeInCubic',
      duration: 300,
      delay: anime.stagger(200, { start: 30 * Math.max(columns, rows) + 500}),
    },
    translateY: {
      value: [-130, 0],
      easing: 'easeInSine',
      duration: 600,
      delay: anime.stagger(200, { start: 30 * Math.max(columns, rows) + 100})
    },
  })
  let loadingcircles = document.getElementsByClassName('circle')
  let loading = anime.timeline({
    easing: 'linear',
    duration: 750,
    loop: true,
  })
  loading
  .add({
    targets: loadingcircles[0],
    easing: 'easeInOutSine',
    translateX: myPath('x'),
    translateY: myPath('y'),
  })
  .add({
    targets: [loadingcircles[1], loadingcircles[2]],
    translateX: -20,
    delay: anime.stagger(100, 200)
  })

}


const createTile = index => {
  const tile = document.createElement("div")
  tile.classList.add("tile")
  tile.style.scale = toggled ? 0 : 1
  tile.onclick = e => click(index)
  return tile
}

const createTiles = quantity => {
  Array.from(Array(quantity)).map((tile, index) => {
    wrapper.appendChild(createTile(index))
  })
}


const setGrid = () => {
  wrapper.innerHTML = ""
  const windowSize = document.body.clientWidth > 800 ? 100 : 50
  columns = Math.floor(document.body.clientWidth / windowSize)
  rows = Math.floor(document.body.clientHeight / windowSize)

  wrapper.style.setProperty("--columns", columns)
  wrapper.style.setProperty("--rows", rows)

  createTiles(columns * rows)
}

setGrid()

window.onresize = setGrid
