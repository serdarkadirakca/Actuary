


/* Donut Chart */
function DonutChart(idName, series, width, height, label, colors, size) {
    var optionsPie = {
        series: series,
        labels: label,
        colors: colors,
        chart: {
            type: 'donut',
            group: 'social',
            width: width,
            height: height,
        },
        legend: {
            show: false
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    minAngleToShowLabel: undefined
                },
                donut: {
                    size: size,
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '16px',
                            fontFamily: 'Jost, sans-serif',
                            color: '#404040',
                            offsetY: -10
                        },
                        value: {
                            show: true,
                            fontSize: '30px',
                            fontFamily: 'Jost, sans-serif',
                            color: "black",
                            fontWeight: "bold",
                            offsetY: 10,
                            formatter: function (val) {
                                return +val + "%"
                            }
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            color: '#404040',
                            fontFamily: 'Jost, sans-serif',
                            formatter: function (w) {
                                return w.globals.seriesTotals.reduce((a, b) => {
                                    return a + b
                                }, 0)
                            }
                        }
                    }
                },
            },
        },
        responsive: [{
            breakpoint: 1399,
            options: {
                chart: {
                    width: "100%"
                },

            }
        }]
    };
    if ($(idName).length > 0) {
        new ApexCharts(document.querySelector(idName), optionsPie).render();
    }
}
DonutChart('.salesDonutToday', [100,0,0,0,0,0], '100%', 243, 
["Casco Insurance","Traffic Insurance","DASK Insurance","Property Insurance","Health Insurance","Other Insurance"], 
["#F78E21","#09B3AD","#BD00FF","#009D19","#0029FF","#FF0000"], "60%");



