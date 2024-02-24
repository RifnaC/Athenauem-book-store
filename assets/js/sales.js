$(document).ready(function () {
    // Chart Global Color
    Chart.defaults.color = "#15877C";
    Chart.defaults.borderColor = "#f0f0f0";

    const genre = document.getElementById("genre").value;
    const genres = genre.split(",");
    const count = document.getElementById('genreCount').value
    const counts = count.split(",").map(Number);
    if (counts.length !== genres.length) {
        while (counts.length !== genres.length) {
            counts.push(0);
        }
    }
    // Single Bar Chart
    const ctx4 = $("#bar-chart").get(0).getContext("2d");
    const myChart4 = new Chart(ctx4, {
        type: "bar",
        data: {
            labels: genres,
            datasets: [{
                label: " Count",
                backgroundColor: [
                    "rgba(21, 135, 124, .7)",
                    "rgba(21, 135, 124, .4)",
                    "rgba(21, 135, 124, .7)",
                    "rgba(21, 135, 124, .4)",
                    "rgba(21, 135, 124, .7)",
                    "rgba(21, 135, 124, .4)",
                    "rgba(21, 135, 124, .7)",
                    "rgba(21, 135, 124, .4)",
                ],
                data: counts
            }]
        },
        options: {
            responsive: true
        }
    });

    const booknames = document.getElementById('booknames').value;
    const names = booknames.split(",");
    const amounts = document.getElementById('amount').value;
    const amount = amounts.split(",").map(Number);
    // Pie Chart
    const ctx5 = $("#pie-chart").get(0).getContext("2d");
    const myChart5 = new Chart(ctx5, {
        type: "pie",
        data: {
            labels: names,
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