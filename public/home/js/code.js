let menubox
let menux
let menustate
let currentTheme = localStorage.getItem('theme') ?? 'light'

const tgl = () => {
    currentTheme = currentTheme == 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', currentTheme)
    localStorage.setItem('theme', currentTheme)
}
document.documentElement.setAttribute('data-theme', currentTheme)


const Start = () => {
    menubox = document.getElementById('menubox')
    menux = document.getElementById('menux')
    menux.classList.remove('open')

}

const tglMenu = () => {
    menustate = menustate == 'open' ? 'closed' : 'open'
    if (menustate == 'open') {
        menubox.style.left = `0px`
        menux.classList.add('open')
    }
    else{
        menubox.style.left = ``
        menux.classList.remove('open')
    }

}

window.onscroll = function() {scrollFunction()}

function scrollFunction() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 20) {
    document.getElementById("bar").classList.add('scrollstuff')
  } else {
    document.getElementById("bar").classList.remove('scrollstuff')
  }
} 