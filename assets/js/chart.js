$(document).ready(function () {
    // Chart Global Color
    Chart.defaults.color = "#15877C";
    Chart.defaults.borderColor = "#f0f0f0";

    // Single Line Chart
    let ctx3 = $("#line-chart").get(0).getContext("2d");
    let myChart3 = new Chart(ctx3, {
        type: "line",
        data: {
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,31],
            datasets: [{
                fill: false,
                backgroundColor: "#15877C",
                data: [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15]
            }]
        },
        options: {
            responsive: true
        }
    });

    // Single Bar Chart
    const ctx4 = $("#bar-chart").get(0).getContext("2d");
    const myChart4 = new Chart(ctx4, {
        type: "bar",
        data: {
            labels: ["Italy", "France", "Spain", "USA", "Argentina"],
            datasets: [{
                backgroundColor: [
                    "rgba(21, 135, 124, .7)",
                    "rgba(21, 135, 124, .6)",
                    "rgba(21, 135, 124, .5)",
                    "rgba(21, 135, 124, .4)",
                    "rgba(21, 135, 124, .3)"
                ],
                data: [55, 49, 44, 24, 15]
            }]
        },
        options: {
            responsive: true
        }
    });

     // Pie Chart
    const ctx5 = $("#pie-chart").get(0).getContext("2d");
    const myChart5 = new Chart(ctx5, {
        type: "pie",
        data: {
            labels: ["Italy", "France", "Spain", "USA", "Argentina"],
            datasets: [{
                backgroundColor: [
                    "rgba(21, 135, 124, .7)",
                    "rgba(21, 135, 124, .6)",
                    "rgba(21, 135, 124, .5)",
                    "rgba(21, 135, 124, .4)",
                    "rgba(21, 135, 124, .3)"
                 ],
                 data: [55, 49, 44, 24, 15]
             }]
         },
         options: {
             responsive: true
         }
     });

});