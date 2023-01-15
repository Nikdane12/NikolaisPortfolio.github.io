
let currentTheme = localStorage.getItem('theme') ?? 'light'

const tgl = () => {
    // const isDark = currentTheme == 'dark'
    // if(isDark){
    //     currentTheme = 'light'
    // }
    // else {
    //     currentTheme = 'dark'
    // }
    currentTheme = currentTheme == 'dark' ? 'light' : 'dark'
    
    document.documentElement.setAttribute('data-theme', currentTheme)
    localStorage.setItem('theme', currentTheme)
}

document.documentElement.setAttribute('data-theme', currentTheme)

const Start = ()=>{
}

