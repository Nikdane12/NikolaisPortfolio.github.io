let mainbody
let bar
let menubox
let menux
let menustate
let anim
let currentTheme = localStorage.getItem('theme') ?? 'light'

const tglTheme = () => {
  currentTheme = currentTheme == 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', currentTheme)
  localStorage.setItem('theme', currentTheme)
}
document.documentElement.setAttribute('data-theme', currentTheme)


const Start = () => {
  mainbody = document.getElementById('mainbody')
  mainbodyforcards = document.getElementById('mainbodyforcards')
  bar = document.getElementById('bar')
  menubox = document.getElementById('menubox')
  menux = document.getElementById('menux')
  anim = document.getElementsByClassName('anim');
  menux.classList.remove('open')
  animate()
  window.onscroll = animate
}

const tglMenu = () => {
  menustate = menustate == 'open' ? 'closed' : 'open'
  if (menustate == 'open') {
    menubox.style.left = `0px`
    menux.classList.add('open')
    if(mainbody){mainbody.addEventListener("click", tglMenu)}
    if(mainbodyforcards){mainbodyforcards.addEventListener("click", tglMenu)}
  }
  else {
    menubox.style.left = ``
    menux.classList.remove('open')
    if(mainbody){mainbody.removeEventListener("click", tglMenu)}
    if(mainbodyforcards){mainbodyforcards.removeEventListener("click", tglMenu)}
  }
}

const animate = () => {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 20) {
    bar.classList.add('scrollstuff')
  } else {
    bar.classList.remove('scrollstuff')
  }
  for (var i = 0; i < anim.length; i++) {
    let windowHeight = window.innerHeight
    let elementTop = anim[i].getBoundingClientRect().top
    let elementVisible = 150
    if (elementTop < windowHeight - elementVisible) {
      anim[i].classList.add("animstart")
    } else {
      anim[i].classList.remove("animstart")
    }
  }
}

