let result = [1, 2, 3, 4, 5, 6]
let yearsarray = [1, 2, 3, 4, 5, 6]
let slider = document.getElementById("colorslider")
let base
let interestrate
let years

const data = {
  labels: yearsarray,
  datasets: [{
    label: 'Sparing per år',
    data: result,
    backgroundColor: 'hsla(100, 100%, 50%, 1)',
    borderWidth: 1
  }]
}

const config = {
  type: 'bar',
  data:{
    labels: [1],
    datasets: [{
      label: 'Sparing per år',
      data: [1],
      backgroundColor: 'hsla(100, 100%, 50%, 1)',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
}

const myChart = new Chart(
  document.getElementById('chart'),
  config
);

const startup = () => {
  changecolor()
  update()
}

const update = () => {
  result = []
  yearsarray = []
  years = Number(document.getElementById('yearinput').value)
  base = Number(document.getElementById('baseinput').value)
  interestrate = Number(document.getElementById('interestrateinput').value)
  for (var i = 0; i < years + 1; ++i) { 
    result.push(Math.floor(base * (1 + interestrate) ** i))
    yearsarray.push(i)
  }
  myChart.config.data.datasets[0].data = result
  myChart.data.labels = yearsarray
  myChart.update()
}

const changecolor = () => {
  myChart.data.datasets[0].backgroundColor = `hsl(${JSON.parse(document.getElementById("colorslider").value)}, 100%, 50%)`
  // console.log((document.getElementById("colorslider").value));
  myChart.update()
}

slider.oninput = changecolor

//  for (var i = 0; i < JSON.parse(document.getElementById('yearinput').value) + 1; ++i) {
//    result.push(Math.floor(document.getElementById('baseinput').value) * (1 + JSON.parse(document.getElementById('interestrateinput').value)) ** i)


/*
const j = i++
means
set j to i and then add one to i
const z = ++i
means
add one to i and then set z to i

*/