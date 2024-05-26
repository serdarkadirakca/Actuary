function chartjsLineChart(selector, height, dataCur, labels, labelName, fill) {
    let delayed;
    let primaryColorRGB;
    let primaryColor;
    primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
    primaryColorRGB = getComputedStyle(document.documentElement).getPropertyValue(
        '--color-primary-rgba'
    );
    var ctx = document.getElementById(selector);
    if (ctx) {
        ctx.getContext("2d");
        ctx.height = window.innerWidth <= 1399 ? (window.innerWidth < 575 ? 200 : 150) : height;
        var charts = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    data: dataCur,
                    borderColor: primaryColor,
                    backgroundColor: () =>
                        chartLinearGradient(document.getElementById(selector), 300, {
                            start: `rgba(${primaryColorRGB},0.5)`,
                            end: 'rgba(255,255,255,0.05)'
                        }),
                    fill: fill,
                    label: labelName,
                    pointBackgroundColor: primaryColor,
                    tension: 0.4,
                    borderWidth: 3,
                    hoverRadius: '6',
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHitRadius: 30,
                    pointStyle: 'circle',
                    pointHoverBorderWidth: 2,

                }, ],
            },
            options: {
                maintainAspectRatio: true,
                responsive: true,
                interaction: {
                    mode: 'index',
                },
                plugins: {
                    legend: {
                        display: false,
                        position: "bottom",
                        align: "start",
                        labels: {
                            boxWidth: 6,
                            display: true,
                            usePointStyle: true,
                        },
                    },
                    tooltip: {
                        usePointStyle: true,
                        enabled: false,
                        external: customTooltips,
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';

                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat().format(context.parsed.y);
                                }
                                return `<span class="data-label">${label}k</span>`;
                            }
                        },
                    },
                },
                animation: {
                    onComplete: () => {
                        delayed = true;
                    },
                    delay: (context) => {
                        let delay = 0;
                        if (context.type === 'data' && context.mode === 'default' && !delayed) {
                            delay = context.dataIndex * 200 + context.datasetIndex * 50;
                        }
                        return delay;
                    },
                },
                layout: {
                    padding: {
                        left: -13,
                        right: -10,
                        top: 0,
                        bottom: 0,
                    },
                },
                elements: {
                    point: {
                        radius: 0,
                    },
                },
                scales: {
                    y: {
                        grid: {
                            color: "#485e9029",
                            borderDash: [3, 3],
                            zeroLineColor: "#485e9029",
                            zeroLineWidth: 1,
                            zeroLineBorderDash: [3, 3],
                            drawTicks: false,
                            drawBorder: false,
                            zeroLineWidth: 3,
                            borderWidth: 0,
                        },
                        ticks: {
                            beginAtZero: true,
                            font: {
                                size: 14,
                                family: "'Jost', sans-serif",
                            },
                            color: '#747474',
                            padding: 15,
                            max: 80,
                            min: 0,
                            stepSize: 20,
                            callback(value, index, values) {
                                return `${value}k`;
                            },
                        },
                    },
                    x: {
                        grid: {
                            display: true,
                            zeroLineWidth: 2,
                            zeroLineColor: "transparent",
                            color: "transparent",
                            z: 1,
                            tickMarkLength: 10,
                            drawTicks: true,
                            drawBorder: false,
                        },

                        ticks: {
                            beginAtZero: true,
                            font: {
                                size: 14,
                                family: "'Jost', sans-serif",
                            },
                            color: '#747474'
                        },
                    },
                },
            },
        });
    }
}
chartjsLineChart(
    "saleRevenueMonth",
    "113",
    (data = [128.5,126.6,144.1,142.1,130.1,132.6,127.2,125.9,132.9,125.7,131.5,117.3,]),
    labels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ],
    "Profit",
    true
);