/* requires editor */

let ctx = document.getElementById('myChart').getContext('2d')
let myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: Object.entries(editor.stats.distribution).sort(), //'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    datasets: [{
      label: 'Letter Distribution',
      data: Object.values(editor.stats.distribution),
      backgroundColor:
        'rgba(18, 105, 163, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
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
})
