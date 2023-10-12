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

    // Function to validate the form
    function validateForm() {
      let name = document.forms["upload_user"]["name"].value;
      let email = document.forms["upload_user"]["email"].value;
      let password = document.forms["upload_user"]["password"].value;
      let confirmPassword = document.forms["upload_user"]["confirmPassword"].value;
  
      // Check if name, email, password, and confirmPassword are not empty
      if (name === "" || email === "" || password === "" || confirmPassword === "") {
        alert("All fields must be filled out");
        return false;
      }

      if (name.length < 3 ) {
        alert("Name should have at least 3 characters");
        return false;
      }
      if (password.length < 6) {
        alert("Passwords should have at least 6 characters");
        return false;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return false;
      }
      return true;
    }
  
    $("#upload_user").submit(function(event) {
        if (!validateForm()) {
            event.preventDefault();
        }else{
            alert("new admin data is inserted Successfully"); 
        }
             
    })

    $("#edit_admin").submit(function(event) {
        event.preventDefault();
    
        let unindexed_array = $(this).serializeArray();
        let data = {};
    
        $.map(unindexed_array, function(n, i) {
            data[n['name']] = n['value'];
        });
    
        console.log(data);
    
        // Extract the admin's ID from the form data
        const adminId = data.id;
    
        // Validation: Check if the name and email fields are empty
        if (!data.name || !data.email) {
            alert("Name and email fields are required.");
            return;
        }
        if (data.name.length < 4) {
            alert("Name and email fields are required.");
            return;
        }
    
        // Validation: Check if the new password and confirm password match
        if (data.newPassword !== data.confirmPassword) {
            alert("New password and confirm password must match.");
            return;
        }
    
        // Check if a new password is provided
        if (data.newPassword) {
            // Hash the new password with bcrypt
            bcrypt.hash(data.newPassword, saltRounds, function(err, hashedPassword) {
                if (err) {
                    console.error(err);
                    alert("Error hashing the new password");
                } else {
                    // Update the 'password' field with the hashed password
                    data.password = hashedPassword;
    
                    // Create the AJAX request
                    let request = {
                        "url": `http://localhost:3000/api/admins/${adminId}`,
                        "method": "PUT",
                        "data": data
                    };
    
                    // Send the PUT request
                    $.ajax(request).done(function(response) {
                        alert("Admin data updated successfully");
                    });
                }
            });
        } else {
            // If no new password is provided, update without hashing
            let request = {
                "url": `http://localhost:3000/api/admins/${adminId}`,
                "method": "PUT",
                "data": data
            };
    
            // Send the PUT request
            $.ajax(request).done(function(response) {
                alert("Data updated successfully");
                window.location.href='/admin';
            });
        }
    });
let $ondelete;

    if(window.location.pathname=="/admin"){
        $ondelete = $(".table tbody td a.delete");
        $ondelete.click(function(){
            const id= $(this).attr('data-id')

            const request = {
                "url":`http://localhost:3000/api/admins/${id}`,
                "method":"DELETE"
            }
            if(confirm("DO you really want to delete this record?")){
                $.ajax(request).done(function(response){
                    alert("Data deleted Successfully");
                    location.reload()
                })
            }
        })

    }
    // Function to validate the form
    function shopValidation() {
      let name = document.forms["add_shop"]["name"].value;
      let address = document.forms["add_shop"]["address"].value;
      let openingTime = document.forms["add_shop"]["openingTime"].value;
      let closingTime = document.forms["add_shop"]["closingTime"].value;
  
      // Check if name, email, password, and confirmPassword are not empty
      if (name === "" ) {
        alert("Name field must be filled out");
        return false;
      }
      if (name.length < 3 ) {
        alert("Name should have at least 3 characters");
        return false;
      }
      if (address === "" ) {
        alert("Address field must be filled out");
        return false;    
      }
      if ( openingTime === "") {
        alert("Address field must be filled out");
        return false;
      } 

      if (closingTime === "" ) {
        alert("Address field must be filled out");
        return false;
      }
      if (openingTime === closingTime) {
        alert("Provide valid Working hours ");
        return false;
      }
      return true;
    }

    $("#add_shop").submit(function(event) {
        if (!shopValidation()) {
            event.preventDefault();
        }else{
            
            alert("new shop data is inserted Successfully"); 
        }
             
    })



    $("#edit_shop").submit(function(event) {
        event.preventDefault();
    
        let unindexed_array = $(this).serializeArray();
        let data = {};
    
        $.map(unindexed_array, function(n, i) {
            data[n['name']] = n['value'];
        });
    
        // console.log(data);
    
        // Extract the shop's ID from the form data
        const shopId = data.id;
    
        // Validation
        if (!data.name ) {
            alert("Name field is required.");
            return;
        }

        if (!data.address ) {
            alert("Address field is required.");
            return;
        }
        if (!data.openingTime || !data.closingTime) {
            alert("Time fields are required.");
            return;
        }
            // If no new password is provided, update without hashing
            let request = {
                "url": `http://localhost:3000/api/shops/${shopId}`,
                "method": "PUT",
                "data": data
            };
            console.log(shopId)
            // Send the PUT request
            $.ajax(request).done(function(response) {
                alert("Shop data updated successfully");
                window.location.href='/shop';
            });
    
    });


    let $ondeleteShop;

    if(window.location.pathname=="/shop"){
        $ondeleteShop = $(".shopCard a.delete");
        $ondeleteShop.click(function(){
            const id= $(this).attr('data-id')

            const request = {
                "url":`http://localhost:3000/api/shops/${id}`,
                "method":"DELETE"
            }
            if(confirm("DO you really want to delete this record?")){
                $.ajax(request).done(function(response){
                    alert("Data deleted Successfully");
                    location.reload()
                })
            }
        })
    }


    
    function productValidation() {
        let genre = document.forms["add_product"]["genre"].value;
        let bookName = document.forms["add_product"]["bookName"].value;
        let author = document.forms["add_product"]["author"].value;
        let quantity = document.forms["add_product"]["quantity"].value;
        let description = document.forms["add_product"]["description"].value;
        let price = document.forms["add_product"]["price"].value;
    
        // Check if name, email, password, and confirmPassword are not empty
        if (genre === "" ) {
          alert("Category field must be filled out");
          return false;
        }
        if (bookName === "") {
          alert("Book name field must be filled out");
          return false;
        }
        if (author === "" ) {
          alert("Author field must be filled out");
          return false;    
        }
        if (quantity === "") {
          alert("Quantity field must be filled out");
          return false;
        } 
  
        if (description === "" ) {
          alert("Description field must be filled out");
          return false;
        }
        if (price === "") {
          alert("Price field must be filled out");
          return false;
        }
        return true;
      }


    $("#add_product").submit(function(event) {
        if (!productValidation()) {
            event.preventDefault();
        }else{
            
            alert("new book data is inserted Successfully"); 
        }
             
    })


    $("#edit_product").submit(function(event) {
        event.preventDefault();
    
        let unindexed_array = $(this).serializeArray();
        let data = {};
    
        $.map(unindexed_array, function(n, i) {
            data[n['name']] = n['value'];
        });
    
        // console.log(data);
    
        // Extract the book's ID from the form data
        const bookId = data.id;
    
        // Validation
        if (!data.genre === "" ) {
            alert("Category field is required");
            return;
          }
          if (!data.bookName === "") {
            alert("Book name field is required.");
            return;
          }
          if (!data.author === "" ) {
            alert("Author field is required.");
            return;    
          }
          if (!data.quantity === "") {
            alert("Quantity field is required.");
            return;
          } 
    
          if (!data.description === "" ) {
            alert("Description field is required.");
            return;
          }
          if (!data.price === "") {
            alert("Price field is required.");
            return;
          }

            let request = {
                "url": `http://localhost:3000/api/products/${bookId}`,
                "method": "PUT",
                "data": data
            };
            // console.log(shopId)
            // Send the PUT request
            $.ajax(request).done(function(response) {
                alert("Book data updated successfully");
                window.location.href='/products';
            });
    
    });


    let $ondeleteProduct;

    if(window.location.pathname=="/products"){
        $ondeleteProduct = $(".table tbody td a.delete");
        $ondeleteProduct.click(function(){
            const id= $(this).attr('data-id')

            const request = {
                "url":`http://localhost:3000/api/products/${id}`,
                "method":"DELETE"
            }
            if(confirm("DO you really want to delete this record?")){
                $.ajax(request).done(function(response){
                    alert("Data deleted Successfully");
                    location.reload()
                })
            }
        })
    }

function categoryValidation(){
        let genre = document.forms["add_cat"]["genre"].value;
        let totalBooks = document.forms["add_cat"]["totalBooks"].value;
        let totalEarnings = document.forms["add_cat"]["totalEarnings"].value;
        // Check if name, email, password, and confirmPassword are not empty
        if (genre === "" ) {
          alert("Genre field must be filled out");
          return false;
        }
        if (totalBooks === "") {
          alert("Total Books field must be filled out");
          return false;
        }
        if (totalEarnings === "" ) {
          alert("Total earnings field must be filled out");
          return false;    
        }
        return true;
      }
    $("#add_cat").submit(function(event) {
        if (!categoryValidation()) {
            event.preventDefault();
        }else{
            alert("new book data is inserted Successfully"); 
        }
             
    })


    $("#edit_cat").submit(function(event) {
        event.preventDefault();
    
        let unindexed_array = $(this).serializeArray();
        let data = {};
    
        $.map(unindexed_array, function(n, i) {
            data[n['name']] = n['value'];
        });
    
        // console.log(data);
    
        // Extract the genre's ID from the form data
        const genreId = data.id;
        console.log(genreId);
    
        // Validation
        if (!data.genre === "" ) {
            alert("Genre field is required");
            return;
          }
          if (!data.totalBooks === "") {
            alert("Provide total books available.");
            return;
          }
          if (!data.totalEarnings === "" ) {
            alert("Provide the total earnings of the books.");
            return;    
          }
            let request = {
                "url": `http://localhost:3000/api/categories/${genreId}`,
                "method": "PUT",
                "data": data
            };
            // console.log(shopId)
            // Send the PUT request
            $.ajax(request).done(function(response) {
                alert("Genre data updated successfully");
                window.location.href='/category';
            });
    
    });


    let $ondeleteCategory;

    if(window.location.pathname=="/category"){
        $ondeleteCategory = $(".table tbody td a.delete");
        $ondeleteCategory.click(function(){
            const id= $(this).attr('data-id')

            const request = {
                "url":`http://localhost:3000/api/categories/${id}`,
                "method":"DELETE"
            }
            if(confirm("DO you really want to delete this record?")){
                $.ajax(request).done(function(response){
                    alert("Data deleted Successfully");
                    location.reload()
                })
            }
        })
    }



    // $(document).ready(function() {
    //     const x = $("#address");
  
    //     $("#getLocation").click(function() {
    //       if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(showPosition);
    //       } else {
    //         alert("Geolocation is not supported by this browser.");
    //       }
    //     });
  
    //     function showPosition(position) {
    //       alert("Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
    //     }
    //   });


    // // Progress Bar
    // $('.pg-bar').waypoint(function () {
    //     $('.progress .progress-bar').each(function () {
    //         $(this).css("width", $(this).attr("aria-valuenow") + '%');
    //     });
    // }, {offset: '80%'});


   


    // // Testimonials carousel
    // $(".testimonial-carousel").owlCarousel({
    //     autoplay: true,
    //     smartSpeed: 1000,
    //     items: 1,
    //     dots: true,
    //     loop: true,
    //     nav : false
    // });


    // // Chart Global Color
    // Chart.defaults.color = "#6C7293";
    // Chart.defaults.borderColor = "#000000";


    // Worldwide Sales Chart
    let ctx1 = $("#worldwide-sales").get(0).getContext("2d");
    let myChart1 = new Chart(ctx1, {
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


   

    // // Single Line Chart
    // var ctx3 = $("#line-chart").get(0).getContext("2d");
    // var myChart3 = new Chart(ctx3, {
    //     type: "line",
    //     data: {
    //         labels: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
    //         datasets: [{
    //             label: "Salse",
    //             fill: false,
    //             backgroundColor: "rgba(21, 135, 124, .7)",
    //             data: [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15]
    //         }]
    //     },
    //     options: {
    //         responsive: true
    //     }
    // });


    // // Single Bar Chart
    // var ctx4 = $("#bar-chart").get(0).getContext("2d");
    // var myChart4 = new Chart(ctx4, {
    //     type: "bar",
    //     data: {
    //         labels: ["Italy", "France", "Spain", "USA", "Argentina"],
    //         datasets: [{
    //             backgroundColor: [
    //                 "rgba(21, 135, 124, .7)",
    //                 "rgba(21, 135, 124, .6)",
    //                 "rgba(21, 135, 124, .5)",
    //                 "rgba(21, 135, 124, .4)",
    //                 "rgba(21, 135, 124, .3)"
    //             ],
    //             data: [55, 49, 44, 24, 15]
    //         }]
    //     },
    //     options: {
    //         responsive: true
    //     }
    // });


    // // Pie Chart
    // var ctx5 = $("#pie-chart").get(0).getContext("2d");
    // var myChart5 = new Chart(ctx5, {
    //     type: "pie",
    //     data: {
    //         labels: ["Italy", "France", "Spain", "USA", "Argentina"],
    //         datasets: [{
    //             backgroundColor: [
    //                 "rgba(21, 135, 124, .7)",
    //                 "rgba(21, 135, 124, .6)",
    //                 "rgba(21, 135, 124, .5)",
    //                 "rgba(21, 135, 124, .4)",
    //                 "rgba(21, 135, 124, .3)"
    //             ],
    //             data: [55, 49, 44, 24, 15]
    //         }]
    //     },
    //     options: {
    //         responsive: true
    //     }
    // });


    // // Doughnut Chart
    // var ctx6 = $("#doughnut-chart").get(0).getContext("2d");
    // var myChart6 = new Chart(ctx6, {
    //     type: "doughnut",
    //     data: {
    //         labels: ["Italy", "France", "Spain", "USA", "Argentina"],
    //         datasets: [{
    //             backgroundColor: [
    //                 "rgba(21, 135, 124, .7)",
    //                 "rgba(21, 135, 124, .6)",
    //                 "rgba(21, 135, 124, .5)",
    //                 "rgba(21, 135, 124, .4)",
    //                 "rgba(21, 135, 124, .3)"
    //             ],
    //             data: [55, 49, 44, 24, 15]
    //         }]
    //     },
    //     options: {
    //         responsive: true
    //     }
    // });
   
})(jQuery);


