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
                label: "Amount",
                fill: false,
                backgroundColor: "#15877C",
                data: price,
            }]
        },
        options: {
            responsive: true
        }
    });


    const count = document.getElementById('weekDates').value
    const counts = count.split(",").map(Number);
    if (counts.length !== 7) {
        while (counts.length !== 7) {
            counts.push(0);
        }
    }
    // Single Bar Chart
    const ctx4 = $("#bar-chart").get(0).getContext("2d");
    const myChart4 = new Chart(ctx4, {
        type: "bar",
        data: {
            labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
            datasets: [{
                label: "Orders",
                backgroundColor: [
                    "rgba(21, 135, 124, .7)",
                    "rgba(21, 135, 124, .6)",
                    "rgba(21, 135, 124, .7)",
                    "rgba(21, 135, 124, .6)",
                    "rgba(21, 135, 124, .7)",
                    "rgba(21, 135, 124, .6)",
                    "rgba(21, 135, 124, .7)",
                    "rgba(21, 135, 124, .6)",
                ],
                data: counts
            }]
        },
        options: {
            responsive: true
        }
    });


    const monthlyAmount = document.getElementById('monthlyReport').value;
    const amount = monthlyAmount.split(",").map(Number);
    // Pie Chart
    const ctx5 = $("#pie-chart").get(0).getContext("2d");
    const myChart5 = new Chart(ctx5, {
        type: "pie",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
                backgroundColor: [
                    "rgb(21, 135, 124)",
                    "rgba(21, 135, 124, .9)",
                    "rgba(21, 135, 124, .7)",
                    "rgba(21, 135, 124, .5)",
                    "rgba(21, 135, 124, .3)",
                    "rgba(21, 135, 124, .1)",
                    "rgba(21, 135, 124, .9)",
                    "rgba(21, 135, 124, .7)",
                    "rgba(21, 135, 124, .5)",
                    "rgba(21, 135, 124, .3)",
                    "rgba(21, 135, 124, .1)",
                    "rgba(21, 135, 123)",
                ],
                data: amount,
            }]
        },
        options: {
            responsive: true
        }
    });

});