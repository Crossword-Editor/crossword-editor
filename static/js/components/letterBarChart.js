export default {
  extends: VueChartJs.Bar,
  mixins: [VueChartJs.mixins.reactiveProp],
  props: ['chartData'],
  data: function () {
    return {
      chartOptions: {
        tooltips: {
          enabled: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.chartOptions)
  }
};
