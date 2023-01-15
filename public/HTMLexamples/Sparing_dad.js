/* globals */

let colorsliderinput
let yearsinput
let baseinput
let rateinput
let chart


const startup = () => {

  /* get references to document elements */
  yearsinput = document.getElementById('yearinput')
  baseinput = document.getElementById('baseinput')
  rateinput = document.getElementById('interestrateinput')
  colorsliderinput = document.getElementById("colorslider")
  const chartContainer = document.getElementById('chart')

  /* set event listeners*/
  colorsliderinput.oninput = update

  /* create base chart */
  chart = new Chart(
    chartContainer,
    {
      type: 'bar',
      data: {
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
  );

  /* update page based on element values */
  update()

}

const update = () => {

  /* get page element values */

  const color = Number(colorsliderinput.value)
  const numYears = Number(yearsinput.value)
  const principal = Number(baseinput.value)
  const rate = Number(rateinput.value)

  const numTimesCompoundedPerYear = 1

  if (numYears == NaN || principal == NaN || rate == NaN) {
    alert('error: not a number')
    return
  }

  /* calculate new chart data */
  const xyVals = calCompoundInterestXY(principal, rate, numYears, numTimesCompoundedPerYear)

  const xAxis = xyVals.map(x => x.x)
  const yAxis = xyVals.map(x => x.y)
  const barColor = `hsl(${color}, 100%, 50%)`

  chart.data.labels = xAxis
  chart.data.datasets[0].data = yAxis
  chart.data.datasets[0].backgroundColor = barColor
  chart.update()

}

const calCompoundInterestXY = (p, r, t, n = 1) => InclusiveArrayZeroTo(t).map(x => ({ x, y: calCompoundInterest(p,r,x,n)}))
const InclusiveArrayZeroTo = max => [...Array(max+1).keys()]
const calCompoundInterest =(p, r, t, n = 1) => p * (1 + r / n) ** (t * n) 

// const t=2
// const xAxis =[]
// for(var x=0;x<t+1;x++){xAxis.push(x)}
// // [0,1,2]
// // does the same as this below
// const as = [...Array(t+1).keys()] // [0,1,2]
// const xyVals = xAxis.map(x=>{
//   const y = p * (1 + r / n) ** (x * n)
//   return {
//     x,y
//   }
// })


