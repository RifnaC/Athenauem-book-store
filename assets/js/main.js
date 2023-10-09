(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Sidebar Toggler
    $('.sidebar-toggler').click(function () {
        $('.sidebar, .content').toggleClass("open");
        return false;
    });

    // // alert of inserting new admin
    // $("#upload_user").submit(function(event) {
       
    //     alert("new admin data is inserted Successfully");
    // })



    // Function to validate the form
    function validateForm() {
      var name = document.forms["upload_user"]["name"].value;
      var email = document.forms["upload_user"]["email"].value;
      var password = document.forms["upload_user"]["password"].value;
      var confirmPassword = document.forms["upload_user"]["confirmPassword"].value;
  
      // Check if name, email, password, and confirmPassword are not empty
      if (name === "" || email === "" || password === "" || confirmPassword === "") {
        alert("All fields must be filled out");
        return false;
      }
  
      if (name.length < 4 ) {
        alert("Name should have at least 3 characters");
        return false;
      }
      if (email  ) {
        alert("Name should have at least 3 characters");
        return false;
      }
      // Check if the password and confirmPassword match
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return false;
      }
  
      // You can add more specific validation rules here, like checking the email format.
  
      return true; // Form is valid
    }
  
    // Add a submit event listener to the form
    document.getElementById("upload_user").addEventListener("submit", function (event) {
      if (!validateForm()) {
        event.preventDefault(); // Prevent form submission if validation fails
      }
    });

  




    
    $("#edit_admin").submit(function(event) {
        event.preventDefault();
        let unindexed_array= $(this).serializeArray();
        // console.log(unindexed_array);
        // alert("new admin data is inserted Successfully");
    })
    if(window.location.pathname=="/"){
        $ondelete=$('.table tbody td a.delete');
        $ondelete.click(function(){
            const id= $(this).attr('data-id')

            const request = {
                "url":`http://localhost:3000/api/admins/${id}`,
                "method":"DELETE"
            }
            if(confirm("DO you really want to delete this admin?")){
                $.ajax(request).done(function(response){
                    alert("Data deleted Successfully");
                    location.reload()
                })
            }
        })

    }

    // Progress Bar
    $('.pg-bar').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


   


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: true,
        loop: true,
        nav : false
    });


    // Chart Global Color
    Chart.defaults.color = "#6C7293";
    Chart.defaults.borderColor = "#000000";


    // Worldwide Sales Chart
    var ctx1 = $("#worldwide-sales").get(0).getContext("2d");
    var myChart1 = new Chart(ctx1, {
        type: "bar",
        data: {
            labels: ["Jan", "Feb", "March", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
                    label: "Sales",
                    data: [15, 30, 55, 65, 60, 80, 95, 65, 30, 55, 65, 60, 80],
                    backgroundColor: "rgba(21, 135, 124, .7)"
                }
            ]
            },
        options: {
            responsive: true
        }
    });


   

    // Single Line Chart
    var ctx3 = $("#line-chart").get(0).getContext("2d");
    var myChart3 = new Chart(ctx3, {
        type: "line",
        data: {
            labels: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
            datasets: [{
                label: "Salse",
                fill: false,
                backgroundColor: "rgba(21, 135, 124, .7)",
                data: [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15]
            }]
        },
        options: {
            responsive: true
        }
    });


    // Single Bar Chart
    var ctx4 = $("#bar-chart").get(0).getContext("2d");
    var myChart4 = new Chart(ctx4, {
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
    var ctx5 = $("#pie-chart").get(0).getContext("2d");
    var myChart5 = new Chart(ctx5, {
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


    // Doughnut Chart
    var ctx6 = $("#doughnut-chart").get(0).getContext("2d");
    var myChart6 = new Chart(ctx6, {
        type: "doughnut",
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
   
})(jQuery);


