let wrapper = document.getElementById('wrapper')
let demo = document.getElementsByClassName('demo')

let animation = anime({
    targets: demo,
    translateY: [
      {value: 0, easing: 'easeOutSine', duration: 100},
      {value: 100, easing: 'easeInSine', duration: 100}
    ],
    delay: anime.stagger(300, {easing: 'linear'}),
    autoplay: false,
  })


  let play = false;

function toggleAnimation() {
  console.log(play)
  if (play) {
    console.log('justplayed');
    animation.reverse()
    console.log('reverse');
  } else {
    console.log('isplaying');
    animation.play()
    console.log('play');
  }
  play = !play;
  setTimeout(function() {}, 200);
}

wrapper.onclick = toggleAnimation