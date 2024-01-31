$(document).ready(function () {
    // Chart Global Color
    Chart.defaults.color = "#15877C";
    Chart.defaults.borderColor = "#f0f0f0";

    const dates = document.getElementById('dates').value;
    const date = dates.split(",").map(Number);
    const amounts = document.getElementById('amounts').value;
    const price = amounts.split(",").map(Number);

    // Single Line Chart
    let ctx3 = $("#line-chart").get(0).getContext("2d");
    let myChart3 = new Chart(ctx3, {
        type: "line",
        data: {
            labels: date,
            datasets: [{
                label: "Amount Received",
                fill: false,
                backgroundColor: "#15877C",
                data:price,
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