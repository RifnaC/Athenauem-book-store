(function ($) {
  "use strict";
  // Spinner
  const spinner = function () {
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

  // back to top button
  $('.back-to-top').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
    return false;
  });

  // Sidebar Toggler
  $('.sidebar-toggler').click(function () {
    $('.sidebar, .content').toggleClass("open");
    return false;
  });

  function SweetAlert(){
    if(this.cond!){
      icon
    }
  }
  //Admin alerts
  // Function to validate the add admin form
  function validateForm() {
    let name = document.forms["uploadUser"]["name"].value;
    let email = document.forms["uploadUser"]["email"].value;
    let password = document.forms["uploadUser"]["password"].value;
    let confirmPassword = document.forms["uploadUser"]["confirmPassword"].value;

    // Check if name, email, password, and confirmPassword are not empty
    if (name === "") {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your name!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (name.length < 3) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Name should have at least 3 characters!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (email === "") {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your email!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (password === "") {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your password!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (confirmPassword === "") {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your  confirm password!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (password.length < 6) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Passwords should have at least 6 characters!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (password !== confirmPassword) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Password and the confirm password should be same!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    return true;
  }
  // Add new admin
  $("#uploadUser").submit(function (event) {
    if (!validateForm()) {
      event.preventDefault();
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Athenuam',
        text: 'New admin data is inserted Successfully',
        showConfirmButton: true,
        confirmButtonColor: '#15877C',
      })
    }
  })
  // update admin
  $("#edit_admin").submit(function (event) {
    event.preventDefault();
    let unindexed_array = $(this).serializeArray();
    let data = {};

    $.map(unindexed_array, function (n, i) {
      data[n['name']] = n['value'];
    });
    // Extract the admin's ID from the form data
    const adminId = data.id;
    // Validation: Check if the name and email fields are empty
    if (!data.name) {
      Swal.fire({
        title: 'Athenuam',
        text: 'Please enter the name!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (data.name.length < 4) {
      Swal.fire({
        title: 'Athenuam',
        text: 'Name should be at least 4 characters',
        confirmButtonColor: '#15877C',
      });
      return;
    }
    if (!data.email) {
      Swal.fire({
        title: 'Athenuam',
        text: 'Please enter the name!',
        confirmButtonColor: '#15877C',
      })
      return;
    }

    let request = {
      "url": `http://localhost:3000/api/admins/${adminId}`,
      "method": "PUT",
      "data": data
    };
    // Send the PUT request
    $.ajax(request).done(function (response) {
      Swal.fire({
        title: 'Athenuam',
        text: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
        confirmButtonColor: '#15877C'
      })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            Swal.fire({
              icon: 'success',
              title: 'Athenuam',
              confirmButtonColor: '#15877C',
              text: 'Data updated successfully',
            }).then((result) => {
              window.location.href = '/admin';
            })
          } else if (result.isDenied) {
            Swal.fire({
              icon: 'info',
              title: 'Athenuam',
              text: 'Changes are not saved',
              confirmButtonColor: '#15877C',
            })
              .then((result) => {
                window.location.href = '/admin';
              })
          }
        })
    });
  });

  //delete admin
  if (window.location.pathname === "/admin") {
    $(document).on("click", ".table tbody td a.delete", function (event) {
      event.preventDefault();
      const id = $(this).attr('data-id');
      const request = {
        "url": `http://localhost:3000/api/admins/${id}`,
        "method": "DELETE"
      };
      Swal.fire({
        title: 'Atheneuam',
        text: 'Do you really want to delete this record?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'cancel',
        confirmButtonColor: '#d33',
      })
        .then((result) => {
          if (result.isConfirmed) {
            // The user clicked the "Yes, delete it" button
            $.ajax(request).done(function (response) {
              Swal.fire({
                icon: 'success',
                title: 'Atheneuam',
                text: 'Data deleted Successfully',
                confirmButtonColor: '#15877C'
              }).then(() => {
                location.reload();
              });
            });
          } else {
            // The user clicked the "cancel" button or closed the dialog
            Swal.fire({
              icon: 'info',
              title: 'Atheneuam',
              text: 'Action canceled',
              confirmButtonColor: '#15877C'
            });
          }
        });
    })
  }
  // shop alerts
  // Function to validate the shop form
  function shopValidation() {
    let name = document.forms["add_shop"]["name"].value;
    let address = document.forms["add_shop"]["address"].value;
    let openingTime = document.forms["add_shop"]["openingTime"].value;
    let closingTime = document.forms["add_shop"]["closingTime"].value;
    let shopImg = document.forms["add_shop"]["shopImg"].value;
    // Check if name, email, password, and confirmPassword are not empty
    if (name === "") {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter the shop name!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (name.length < 3) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Shop name should have at least 3 characters!',
        confirmButtonColor: '#15877C'
      })
      return false;
    }
    if (address === "") {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter the address of shop!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (openingTime === "") {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter opening time of the shop!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (closingTime === "") {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter closing time of the shop!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (openingTime === closingTime) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Opening time and closing time should not be same!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (shopImg === "") {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please upload shop image!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    return true;
  }

  // add shop
  $("#add_shop").submit(function (event) {
    if (!shopValidation()) {
      Swal.fire({
        icon: 'error',
        title: 'Atheneuam',
        text: 'Please check your inputs and try again.',
        confirmButtonColor: '#15877C',
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Atheneuam',
        text: 'New shop is added Successfully! ',
        showConfirmButton: true,
        confirmButtonColor: '#15877C'
      })
    }
  })

  //update shop details
  $("#edit_shop").submit(function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const shopId = formData.get('id');

    if (!formData.get('name')) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter the shop name!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (!formData.get('address')) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter the address of shop!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (!formData.get('openingTime') || !formData.get('closingTime')) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter opening time and closing time of the shop!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (formData.get('openingTime') === formData.get('closingTime')) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Opening time and closing time of the shop should not be same!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (!formData.get('shopImg')) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please upload shop image!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    // Append the shopId to the URL
    const request = {
      url: `http://localhost:3000/api/shops/${shopId}`,
      method: 'PUT',
      data: formData,
      processData: false,
      contentType: false,
    };

    $.ajax(request)
      .done(function (response) {
        Swal.fire({
          title: 'Atheneuam',
          text: 'Do you want to save the changes?',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Save',
          denyButtonText: `Don't save`,
          confirmButtonColor: '#15877C',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              icon: 'success',
              title: 'Atheneuam',
              text: 'Shop is updated Successfully! ',
              showConfirmButton: true,
              confirmButtonColor: '#15877C',
            }).then(() => {
              window.location.href = '/shop';
            });
          } else if (result.isDenied) {
            Swal.fire({
              icon: 'info',
              title: 'Atheneuam',
              text: 'Changes are not saved! ',
              showConfirmButton: true,
              confirmButtonColor: '#15877C',
            }).then(() => {
              window.location.href = '/shop';
            });
          }
        });
      })
      .fail(function (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update data',
          confirmButtonColor: '#15877C',
        });
      });
  });

  // Delete the shop
  if (window.location.pathname === "/shop") {
    $(document).on("click", ".shopCard a.delete", function (event) {
      event.preventDefault();
      const id = $(this).attr('data-id');
      const request = {
        "url": `http://localhost:3000/api/shops/${id}`,
        "method": "DELETE"
      };
      Swal.fire({
        title: 'Atheneuam',
        text: 'Do you really want to delete this record?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'cancel',
        confirmButtonColor: '#d33',
      })
        .then((result) => {
          if (result.isConfirmed) {
            // The user clicked the "Yes, delete it" button
            $.ajax(request).done(function (response) {
              Swal.fire({
                icon: 'success',
                title: 'Atheneuam',
                text: 'Data deleted Successfully!',
                showConfirmButton: true,
                confirmButtonColor: '#15877C',
              }).then(() => {
                location.reload();
              });
            });
          } else {
            // The user clicked the "cancel" button or closed the dialog
            Swal.fire({
              icon: 'info',
              title: 'Atheneuam',
              text: 'Action canceled!',
              showConfirmButton: true,
              confirmButtonColor: '#15877C',
            });
          }
        });
    })
  }

  // Validation for adding new book
  function productValidation() {
    let genre = document.forms["add_product"]["genre"].value;
    let bookName = document.forms["add_product"]["bookName"].value;
    let productImg = document.forms["add_product"]["productImg"].value;
    let author = document.forms["add_product"]["author"].value;
    let quantity = document.forms["add_product"]["quantity"].value;
    let description = document.forms["add_product"]["description"].value;
    let price = document.forms["add_product"]["price"].value;
    let originalPrice = document.forms["add_product"]["originalPrice"].value;
    let discount = document.forms["add_product"]["discount"].value;
    let stock = document.forms["add_product"]["stock"].value;

    // Check if book details are not empty
    if (bookName === "") {
      Swal.fire({
        title: 'Athenuam',
        text: 'Please enter book name!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (bookName.length < 4) {
      Swal.fire({
        title: 'Athenuam',
        text: 'Book Name should have at least 4 characters!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (productImg === " ") {
      Swal.fire({
        title: 'Athenuam',
        text: 'Please enter the product image of the book!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (author === "") {
      Swal.fire({
        title: 'Athenuam',
        text: 'Please enter Author field!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (author.length < 4) {
      Swal.fire({
        title: 'Athenuam',
        text: 'Author should have at least 4 characters!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (description === "") {
      Swal.fire({
        title: 'Athenuam',
        text: 'Please provide the decription of the book!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (description.length < 4) {
      Swal.fire({
        title: 'Athenuam',
        text: 'Description should have at least 4 characters!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (originalPrice === " ") {
      Swal.fire({
        title: 'Athenuam',
        text: 'Please enter the original price of the book!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (discount === " ") {
      Swal.fire({
        title: 'Athenuam',
        text: 'Please enter the discount of the book!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (price === "") {
      Swal.fire({
        title: 'Athenuam',
        text: 'Please enter the price of the Book!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (stock === " ") {
      Swal.fire({
        title: 'Athenuam',
        text: 'Please enter the stock of the book!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (productImg === "") {
      Swal.fire({
        title: 'Athenuam',
        text: 'Please provide the image of the book!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    return true;
  }
  // Get parameter from URL
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    // alert('url' =  url);
    name = name.replace(/[\[\]]/g, "\\$&");
    // alert('name' =  name);

    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    // alert('results' =  results);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  const idFromURL = getParameterByName('id');
  $('#shopId').val(idFromURL);


  // Add new book
  $("#add_product").submit(function (event) {
    if (!productValidation()) {
      event.preventDefault();
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Atheneaum',
        text: 'New Book is added Successfully',
        showConfirmColor: '#15877C',
      })
    }
  })
  // Update product
  $("#edit_product").submit(function (event) {
    event.preventDefault();
    const formData = new FormData(this);

    formData.append('additionalField', 'additionalValue');
    // Extract the book's ID from the form data
    const bookId = formData.get('id');
    const shopId = formData.get('shopId');
    // Validation
    if (!formData.get('bookName')) {
      Swal.fire({
        title: 'Athenuam',
        text: 'Please enter book name!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (formData.get('bookName').length < 4) {
      Swal.fire({
        title: 'Athenuam',
        text: ' The book name should be at least 4 characters',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (!formData.get('author')) {
      Swal.fire({
        title: 'Athenuam',
        text: 'Please enter Author of the book!',
        confirmButtonColor: '#15877C'
      })
      return;
    }
    if (formData.get('author').length < 3) {
      Swal.fire({
        title: 'Athenuam',
        text: 'The Author should be at least 3 characters',
        confirmButtonColor: '#15877C'
      })
      return;
    }
    if (!formData.get('description')) {
      Swal.fire({
        title: 'Athenuam',
        text: "Please enter the description of the book",
        confirmButtonColor: '#15877C'
      })
      return;
    }
    if (!formData.get('originalPrice')) {
      Swal.fire({
        title: 'Athenuam',
        text: "Please enter the original price of the book",
        confirmButtonColor: '#15877C'
      })
      return;

    }
    if (!formData.get('discount')) {
      Swal.fire({
        title: 'Athenuam',
        text: "Please enter the discount of the book",
        confirmButtonColor: '#15877C'
      })
      return;
    }
    if (!formData.get('stock')) {
      Swal.fire({
        title: 'Athenuam',
        text: "Please enter the stock of the book",
        confirmButtonColor: '#15877C'
      })
      return;
    }
    if (!formData.get('price')) {
      Swal.fire({
        title: 'Athenuam',
        text: "Please enter the price of the book!",
        confirmButtonColor: '#15877C'
      })
      return;
    }
    // Append the bookid to the URL
    const request = {
      'url': `http://localhost:3000/api/products/${bookId}`,
      'method': 'PUT',
      'data': formData,
      processData: false,
      contentType: false,
    };
    // // Send the PUT request        
    $.ajax(request).done(function (response) {
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
        confirmButtonColor: '#15877C'
      })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            Swal.fire({
              icon: 'success',
              title: 'Atheneaum',
              text: 'Data updated successfully',
              confirmButtonColor: '#15877C'
            })
              .then(() => {
                if (!shopId) {
                  window.location.href = '/products';
                } else {
                  window.location.href = '/books?id=' + shopId;
                }
              })
          } else if (result.isDenied) {
            Swal.fire({
              icon: 'info',
              title: 'Atheneuam',
              text: 'Changes are not saved',
              confirmButtonColor: '#15877C'
            })
              .then(() => {
                if (!shopId) {
                  window.location.href = '/products';
                } else {
                  window.location.href = '/books?id=' + shopId;
                }
              })
          }
        }).fail(function (jqXHR, textStatus, errorThrown) {
          console.error('AJAX request failed:', textStatus, errorThrown);
          console.log('XHR status:', jqXHR.status);
          console.log('XHR response text:', jqXHR.responseText);
          Swal.fire('Error', 'Something Went Wrong.', 'error');
        });

    });
  });
  // *************************************ALERT MODIFICATION****************************************/
  // Delete the product
  if (window.location.pathname === "/products" || window.location.pathname === "/books") {
    $(document).on("click", ".table tbody td a.delete", function (event) {
      event.preventDefault();
      const id = $(this).attr('data-id');
      const request = {
        "url": `http://localhost:3000/api/products/${id}`,
        "method": "DELETE"
      };
      Swal.fire({
        title: 'Do you really want to delete this record?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'cancel',
        confirmButtonColor: '#d33',
      })
        .then((result) => {
          if (result.isConfirmed) {
            $.ajax(request).done(function (response) {
              Swal.fire('Data deleted Successfully', '', 'success').then(() => {
                location.reload();
              });
            });
          } else {
            // The user clicked the "cancel" button or closed the dialog
            Swal.fire('Action canceled', '', 'info');
          }
        });
    })
  }
  // validation for category
  function categoryValidation() {
    let genre = document.forms["add_cat"]["genre"].value;
    let totalBooks = document.forms["add_cat"]["totalBooks"].value;
    let description = document.forms["add_cat"]["description"].value;
    let image = document.forms["add_cat"]["categoryImg"].value;
    // Check if name, email, password, and confirmPassword are not empty
    if (genre === "") {
      Swal.fire({
        title: "Please enter a the category ",
        confirmButtonColor: '#15778C',
      })
      return false;
    }
    if (genre.length < 4) {
      Swal.fire({
        title: "Category should be at least 4 characters",
        confirmButtonColor: '#15778C',
      })
      return false;
    }
    if (totalBooks === "") {
      Swal.fire({
        title: "please enter a total books",
        confirmButtonColor: '#15778C',
      })
      return false;
    }
    if (description === "") {
      Swal.fire({
        title: "Please enter the description of the category",
        confirmButtonColor: '#15778C'
      })
      return false;
    }
    if (description.length < 4) {
      Swal.fire({
        title: "The description must be at least 4 characters",
        confirmButtonColor: '#15778C'
      })
      return false;
    }
    if (image === "") {
      Swal.fire({
        title: "Please select an image",
        confirmButtonColor: '#15778C',
      });
      return false;
    }
    return true;
  }
  // add the category
  $("#add_cat").submit(function (event) {
    if (!categoryValidation()) {
      event.preventDefault();
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Successfully added category',
        showConfirmButton: false,
        timer: 6000
      })
    }
  })

  $("#edit_cat").submit(function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    const genreId = formData.get('id');

    if (!formData.get('genre') || formData.get('genre').length < 4) {
      Swal.fire({
        title: 'Please enter a category with at least 4 characters',
        confirmButtonColor: '#15778C',
      });
      return;
    }

    if (!formData.get('totalBooks')) {
      Swal.fire({
        title: 'Please enter the total number of books',
        confirmButtonColor: '#15778c',
      });
      return;
    }

    if (!formData.get('description') || formData.get('description').length < 4) {
      Swal.fire({
        title: 'Please enter a description with at least 4 characters',
        confirmButtonColor: '#15778C',
      });
      return;
    }

    const request = {
      url: `http://localhost:3000/api/categories/${genreId}`,
      method: 'PUT',
      data: formData,
      processData: false,
      contentType: false,
    };

    $.ajax(request)
      .done(function (response) {
        Swal.fire({
          title: 'Do you want to save the changes?',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Save',
          denyButtonText: `Don't save`,
          confirmButtonColor: '#15877C',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire('Saved!', 'Data updated successfully', 'success').then(() => {
              window.location.href = '/category';
            });
          } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info').then(() => {
              window.location.href = '/category';
            });
          }
        });
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error('AJAX request failed:', textStatus, errorThrown);
        Swal.fire('Error', 'Failed to update data. Check the console for details.', 'error');
      });
  });

  // Delete the category
  if (window.location.pathname === "/category") {
    $(document).on("click", ".table tbody td a.delete", function (event) {
      event.preventDefault();
      const id = $(this).attr('data-id');
      const request = {
        "url": `http://localhost:3000/api/categories/${id}`,
        "method": "DELETE"
      };
      Swal.fire({
        title: 'Do you really want to delete this record?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'cancel',
        confirmButtonColor: '#d33',
      })
        .then((result) => {
          if (result.isConfirmed) {
            // The user clicked the "Yes, delete it" button
            $.ajax(request).done(function (response) {
              Swal.fire('Data deleted Successfully', '', 'success').then(() => {
                location.reload();
              });
            });
          } else {
            // The user clicked the "cancel" button or closed the dialog
            Swal.fire('Action cancelled', '', 'info');
          }
        });
    })
  }

  // Banner Section
  // Banner field on option value change
  $('#clickType').on('change', function () {
    if ($(this).val() === "product") {
      $("#bannerProduct").show()
      $("#bannerCategory").hide()
    } else {
      $("#bannerProduct").hide()
      $("#bannerCategory").show()
    }
  })

  // Validation for creating banner
  function bannerValidation() {
    let name = document.forms["createBanner"]["name"].value;
    let shop = document.forms["createBanner"]['shop'].value;
    let type = document.forms["createBanner"]["type"].value;
    let categoryId = document.forms["createBanner"]["categoryId"].value;
    let productId = document.forms["createBanner"]["productId"].value;
    let bannerImg = document.getElementById("bannerImg");
    let desc = document.forms["createBanner"]["description"].value;

    // Check if book details are not empty
    if (!name) {
      Swal.fire({
        title: 'Please enter banner name!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (name.length < 4) {
      Swal.fire({
        title: 'Banner Name should have at least 4 characters!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (!shop) {
      Swal.fire({
        title: 'Please enter shop name!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (shop.length < 4) {
      Swal.fire({
        title: 'Shop Name should have at least 4 characters!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (type === 'category') {
      if (!categoryId || categoryId.length < 4) {
        Swal.fire({
          title: 'please enter the category ID with at least 4 characters!',
          confirmButtonColor: '#15877C',
        })
        return false;
      }
    }
    if (type === 'product') {
      if (!productId || productId.length < 4) {
        Swal.fire({
          title: 'Please enter the product ID with at least 4 characters!',
          confirmButtonColor: '#15877C',
        })
        return false;
      }
    }
    if (!bannerImg.value || !imgUrl) {
      Swal.fire({
        title: 'Please provide the image of the book banner!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (!desc || desc.length < 4 || desc === null) {
      Swal.fire({
        title: 'Please provide the description of the book banner!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    return true;
  }

  // Create new banner  
  $("#createBanner").submit(function (event) {
    if (!bannerValidation()) {
      event.preventDefault();
    } else {
      Swal.fire({
        icon: 'success',
        title: 'New banner is created Successfully',
        showConfirmButton: false,
        timer: 6000
      })
    }
  })

  $('#editClickType').on('change', function () {
    if ($(this).val() === 'category') {
      $("#bannerProductId").hide()
      $("#bannerCategoryId").show()
    } else {
      $("#bannerProductId").show()
      $("#bannerCategoryId").hide()
    }
  })

  // Update banner
  $("#editBanner").submit(function (event) {
    event.preventDefault();
    // Create a FormData object
    const formData = new FormData(this);
    // Append additional data to the FormData object
    formData.append('additionalField', 'additionalValue');
    // Extract the banner's ID from the form data
    const bannerId = formData.get('id');
    // Validation
    if (!formData.get('name')) {
      Swal.fire({
        title: 'Please enter the banner name',
        confirmButtonColor: '#15877C'
      })
      return;
    }
    if (formData.get('name').length < 4) {
      Swal.fire({
        title: 'The banner name should be at least 4 characters',
        confirmButtonColor: '#15877C'
      })
      return;
    }
    if (!formData.get('shop')) {
      Swal.fire({
        title: 'Please enter shop name!',
        confirmButtonColor: '#15877C'
      })
      return;
    }
    if (formData.get('shop').length < 4) {
      Swal.fire({
        title: 'The shop name should be at least 4 characters',
        confirmButtonColor: '#15877C'
      })
      return;
    }

    if (formData.get('type') === 'category') {
      if (!formData.get('categoryId') || formData.get('categoryId').length < 4) {
        Swal.fire({
          title: 'please enter the category ID with at least 4 characters!',
          confirmButtonColor: '#15877C',
        })
        return false;
      }
    } else {
      if (!formData.get('productId') || formData.get('productId').length < 4) {
        Swal.fire({
          title: 'Please enter the product ID with at least 4 characters!',
          confirmButtonColor: '#15877C',
        })
        return false;
      }
    }
    if (!formData.get('description') || formData.get('description').length < 4) {
      Swal.fire({
        title: 'Please enter the descriptin with at least 4 characters!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    // Construct the AJAX request object
    let request = {
      "url": `http://localhost:3000/api/banner/${bannerId}`,
      "method": "PUT",
      "data": formData,  // Use the modified FormData object
      processData: false,
      contentType: false,
    };

    // Send the PUT request
    $.ajax(request).done(function (response) {
      // Display a confirmation SweetAlert
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
        confirmButtonColor: '#15877C'
      })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            // Success message and redirect if user confirms
            Swal.fire('Saved!', 'Data updated successfully', 'success')
              .then(() => {
                window.location.href = '/banner';
              })
          } else if (result.isDenied) {
            // Info message and redirect if user denies
            Swal.fire('Changes are not saved', '', 'info')
              .then(() => {
                window.location.href = '/banner';
              })
          }
        });
    });
  });

  // Delete the Banner
  if (window.location.pathname === "/banner") {
    $(document).on("click", ".banner a.delete", function (event) {
      event.preventDefault();
      const id = $(this).attr('data-id');
      const request = {
        "url": `http://localhost:3000/api/banner/${id}`,
        "method": "DELETE"
      };
      Swal.fire({
        title: 'Do you really want to delete this record?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'cancel',
        confirmButtonColor: '#d33',
      })
        .then((result) => {
          if (result.isConfirmed) {
            // The user clicked the "Yes, delete it" button
            $.ajax(request).done(function (response) {
              Swal.fire('Data deleted Successfully', '', 'success')
                .then(() => {
                  location.reload();
                });
            });
          } else {
            // The user clicked the "cancel" button or closed the dialog
            Swal.fire('Action cancelled', '', 'info');
          }
        });
    })
  }

  // Validation for signUp
  function signupValidation() {
    let name = document.forms["signup"]["name"].value;
    let email = document.forms["signup"]["email"].value;
    let pswd = document.forms["signup"]['password'].value;
    let confirmPswd = document.forms["signup"]["confirmPswd"].value;

    // Check if  sign up form are not empty
    if (!name) {
      Swal.fire({
        title: 'Please enter your name!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (name.length < 4) {
      Swal.fire({
        title: 'The name should at least contain 4 characters!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (!email) {
      Swal.fire({
        title: 'Please enter your email!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (!email.includes('.')) {
      Swal.fire({
        title: 'Please Enter a valid email address!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (!pswd) {
      Swal.fire({
        title: 'Please enter password!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (pswd.length < 6) {
      Swal.fire({
        title: 'Password should have at least six characters!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (!confirmPswd) {
      Swal.fire({
        title: 'Please enter confirm password!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (confirmPswd !== pswd) {
      Swal.fire({
        title: 'Password and confirm password should be same!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    return true;
  }
  // signup
  $("#signup").submit(function (event) {
    if (!signupValidation()) {
      event.preventDefault();
    } else {
      location.window.href = '/signup';
    }
  })

  // Validation for login
  function loginValidation() {
    let email = document.forms["login"]["email"].value;
    let pswd = document.forms["login"]['password'].value;

    // Check if book details are not empty
    if (!email) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your email!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (!email.includes('.')) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please Enter a valid email address!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (!pswd) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter password!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (pswd.length < 6) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Banner Name should have at least six characters!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    return true;
  }
  // login
  $("#login").submit(function (event) {
    if (!loginValidation()) {
      event.preventDefault();
    } else {
      window.location.href = '/login';
    }
  })

  function forgotPassword() {
    const email = document.forms["forgotPswd"]["email"].value;
    if (!email) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your email!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (!email.includes('.')) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please Enter a valid email address!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    return true;
  }
  $("#forgotPswd").submit(function (event) {
    if (!forgotPassword()) {
      event.preventDefault();
    } else {
      window.location.href = '/reset';
    }
  });


  function otpValidation() {
    const otp6 = document.forms["otp"]["otp"].value;
    const email = document.forms["otp"]["email"].value;
    // const otp = Number(otp1 + otp2 + otp3 + otp4 + otp5 + otp6);
    if (!otp1 || !otp2 || !otp3 || !otp4 || !otp5 || !otp6) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter valid OTP!',
        confirmButtonColor: '#15877C',
      });
      return false;
    }
    return true;
  }
  $("#otp").submit(function (event) {
    if (!otpValidation()) {
      event.preventDefault();
    } else {
      window.location.href = '/reset';
    }
  });


  function resetPswd() {
    const password = document.forms["change_pswd"]["password"].value;
    const confirmPswd = document.forms["change_pswd"]["confirmPassword"].value;
    const email = document.forms["change_pswd"]["email"].value;
    const otp = document.forms["change_pswd"]["otp"].value;

    if (!password || !confirmPswd) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter password!',
        confirmButtonColor: '#15877C',
      });
      return false;
    }
    if (confirmPswd !== 6 || password !== 6) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter valid password!',
        confirmButtonColor: '#15877C',
      });
      return false;
    }
    return true;
  }

  $("#change_pswd").submit(function (event) {
    if (!resetPswd()) {
      event.preventDefault();
    } else {
      swal.fire({
        icon: 'success',
        title: 'Atheneuam',
        text: 'Password changed successfully!',
        confirmButtonColor: '#15877C',
      }).then(() => {
        window.location.href = '/login';
      })
    }
  })
  // pagination 
  $(document).ready(function () {
    $('#categoryTable').DataTable({
      "paging": true,
      "pageLength": 10,
    });
  });


  $(function () {
    // Initially show the first 4 categories
    $(".cardCat").slice(0, 4).show();

    // Hide the "Load Less" button initially
    $(".load-less").css('display', 'none');

    // Handle the "Load More" button click
    $("body").on('click touchstart', '.load-more', function (e) {
      e.preventDefault();
      $(".cardCat:hidden").slideDown();

      // Check if there are no hidden categories
      if ($(".cardCat:hidden").length === 0) {
        $(".load-more").css('display', 'none');
        $(".cards").css('width', '90vw');
        $(".load-less").css('display', 'block');
        $("#slide-right-container").css('display', 'none');
      }

      // Scroll to the top of the "Load More" button
      $('html, body').animate({
        scrollTop: $(this).offset().top
      }, 1000);
    });

    // Handle the "Load Less" button click
    $("body").on('click touchstart', '.load-less', function (e) {
      e.preventDefault();
      $(".cardCat:visible").slice(5).slideUp();

      // Show the "Load More" button
      $(".load-less").css('display', 'none');
      $(".load-more").css('display', 'block');
      $("#slide-right-container").css('display', 'block');
    });
  });

  // radio button value
  $(document).ready(function () {
    const selectedStatus = 'Active' || 'Block';
    const selectedRadio = $(`input[name="status"][value="${selectedStatus}"]`);
    selectedRadio.prop('checked', true);
  });

  // update customer
  $("#editUser").submit(function (event) {
    event.preventDefault();
    const formData = $(this).serializeArray();
    const data = {};

    $.each(formData, function () {
      if (this.type === 'radio') {
        const status = $(`input[name="${this.name}"]`);
        const selectedValues = [];
        for (const radioValue of status) {
          if (radioValue.checked) {
            selectedValues.push(radioValue.value);
          }
        }
        data[this.name] = selectedValues;

      } else {
        data[this.name] = this.value;
      }
    });

    // Extract the customer's ID from the form data
    const userId = data.id;
    // Validation: Check if the name and email fields are empty
    if (!data.name) {
      Swal.fire({
        title: 'Athenuam',
        text: 'Please enter the name!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (data.name.length < 3) {
      Swal.fire({
        title: 'Athenuam',
        text: 'Name should be at least 3 characters',
        confirmButtonColor: '#15877C',
      });
      return;
    }
    if (!data.email) {
      Swal.fire({
        title: 'Athenuam',
        text: 'Please enter the name!',
        confirmButtonColor: '#15877C',
      })
      return;
    }

    let request = {
      "url": `http://localhost:3000/users/${userId}`,
      "method": "PUT",
      "data": data
    };
    // Send the PUT request
    $.ajax(request).done(function (response) {
      Swal.fire({
        title: 'Athenuam',
        text: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
        confirmButtonColor: '#15877C'
      })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            Swal.fire({
              icon: 'success',
              title: 'Athenuam',
              confirmButtonColor: '#15877C',
              text: 'Data updated successfully',
            }).then((result) => {
              window.location.href = '/user';
            })
          } else if (result.isDenied) {
            Swal.fire({
              icon: 'info',
              title: 'Athenuam',
              text: 'Changes are not saved',
            })
              .then((result) => {
                window.location.href = '/user';
              })
          }
        })
    });
  });

  // Delete the customer
  if (window.location.pathname === "/user") {
    $(document).on("click", ".table tbody td a.delete", function (event) {
      event.preventDefault();
      const id = $(this).attr('data-id');
      const request = {
        "url": `http://localhost:3000/users/${id}`,
        "method": "DELETE"
      };
      Swal.fire({
        title: 'Atheneuam',
        text: 'Do you really want to delete this record?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'cancel',
        confirmButtonColor: '#d33',
      })
        .then((result) => {
          if (result.isConfirmed) {
            // The user clicked the "Yes, delete it" button
            $.ajax(request).done(function (response) {
              Swal.fire({
                icon: 'success',
                title: 'Atheneuam',
                confirmButtonColor: '#15877C',
                text: 'Data deleted Successfully',
              }).then(() => {
                location.reload();
              });
            });
          } else {
            // The user clicked the "cancel" button or closed the dialog
            Swal.fire({
              icon: 'info',
              title: 'Atheneuam',
              confirmButtonColor: '#15877C',
              text: 'Action canceled',
            });
          }
        });
    })
  }

  // ***********************Offer CRUD Section*******************************
  // add offer
  function offerValidation() {
    let couponCode = document.forms["addCoupon"]["couponCode"].value;
    let expireDate = document.forms["addCoupon"]["expireDate"].value;
    let discount = document.forms["addCoupon"]["discount"].value;

    // Check if couponCode, expireDate and discount are not empty
    if (!couponCode) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your coupon code!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (couponCode.length < 3) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Coupon Code should have at least 3 characters!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (couponCode !== couponCode.toUpperCase()) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Coupon Code Capital letters!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (!expireDate) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter expire date of the coupon!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (!discount) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter discount!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    return true;
  }
  // Add new coupon
  $("#addCoupon").submit(function (event) {
    if (!offerValidation()) {
      event.preventDefault();
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Athenuam',
        text: 'New coupon is created Successfully',
        showConfirmButton: true,
        confirmButtonColor: '#15877C',
      })
    }
  })
  // update admin
  $("#editCoupon").submit(function (event) {
    event.preventDefault();
    let unindexed_array = $(this).serializeArray();
    let data = {};

    $.map(unindexed_array, function (n, i) {
      data[n['name']] = n['value'];
    });
    // Extract the coupon id from the form data
    const couponId = data.id;
    // Validation: Check if the coupon fields are empty
    if (!data.couponCode) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your coupon code!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (data.couponCode.length < 3) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Coupon Code should have at least 3 characters!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (data.couponCode !== data.couponCode.toUpperCase()) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Coupon Code Capital letters!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (!data.expireDate) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter expire date of the coupon!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (!data.discount) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter discount!',
        confirmButtonColor: '#15877C',
      })
      return;
    }

    let request = {
      "url": `http://localhost:3000/coupon/${couponId}`,
      "method": "PUT",
      "data": data
    };
    // Send the PUT request
    $.ajax(request).done(function (response) {
      Swal.fire({
        title: 'Athenuam',
        text: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
        confirmButtonColor: '#15877C'
      })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            Swal.fire({
              icon: 'success',
              title: 'Athenuam',
              confirmButtonColor: '#15877C',
              text: 'Data updated successfully',
            }).then((result) => {
              window.location.href = '/offer';
            })
          } else if (result.isDenied) {
            Swal.fire({
              icon: 'info',
              title: 'Athenuam',
              text: 'Changes are not saved',
              confirmButtonColor: '#15877C',
            })
              .then((result) => {
                window.location.href = '/offer';
              })
          }
        })
    });
  });

  //delete offer
  if (window.location.pathname === "/offer") {
    $(document).on("click", ".table tbody td a.delete", function (event) {
      event.preventDefault();
      const id = $(this).attr('data-id');
      const request = {
        "url": `http://localhost:3000/coupon/${id}`,
        "method": "DELETE",
      };
      Swal.fire({
        title: 'Atheneuam',
        text: 'Do you really want to delete this record?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'cancel',
        confirmButtonColor: '#d33',
      })
        .then((result) => {
          if (result.isConfirmed) {
            // The user clicked the "Yes, delete it" button
            $.ajax(request).done(function (response) {
              Swal.fire({
                icon: 'success',
                title: 'Atheneuam',
                text: 'Data deleted Successfully',
                confirmButtonColor: '#15877C'
              }).then(() => {
                location.reload();
              });
            });
          } else {
            // The user clicked the "cancel" button or closed the dialog
            Swal.fire({
              icon: 'info',
              title: 'Atheneuam',
              text: 'Action canceled',
              confirmButtonColor: '#15877C'
            });
          }
        });
    })
  }

  // ***********************user profile Section*******************************
  // updating the user profile
  $("#userProfile").submit(function (event) {
    event.preventDefault();
    let unindexed_array = $(this).serializeArray();
    let data = {};

    $.map(unindexed_array, function (n, i) {
      data[n['name']] = n['value'];
    });

    // Extract the user's ID from the form data
    const userId = data.id;

    // Validation: Check if the name and email fields are empty
    if (!data.name) {
      Swal.fire({
        title: 'Athenuam',
        text: 'Please enter the name!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (data.name.length < 4) {
      Swal.fire({
        title: 'Athenuam',
        text: 'Name should be at least 4 characters',
        confirmButtonColor: '#15877C',
      });
      return;
    }
    if (!data.email) {
      Swal.fire({
        title: 'Athenuam',
        text: 'Please enter the name!',
        confirmButtonColor: '#15877C',
      })
      return;
    }

    let request = {
      "url": `http://localhost:8080/profiles/${userId}`,
      "method": "PUT",
      "data": data
    };
    // Send the PUT request
    $.ajax(request).done(function (response) {
      Swal.fire({
        title: 'Athenuam',
        text: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
        confirmButtonColor: '#15877C'
      })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            Swal.fire({
              icon: 'success',
              title: 'Athenuam',
              confirmButtonColor: '#15877C',
              text: 'Data updated successfully',
            }).then((result) => {
              window.location.href = '/profile';
            })
          } else if (result.isDenied) {
            Swal.fire({
              icon: 'info',
              title: 'Athenuam',
              text: 'Changes are not saved',
              confirmButtonColor: '#15877C',
            })
              .then((result) => {
                window.location.href = '/admin';
              })
          }
        })
    });
  });

  // radio button value for gender
  $(document).ready(function () {
    const selectedStatus = document.querySelector('#gender').value;
    const selectedRadio = $(`input[name="gender"][value="${selectedStatus}"]`);
    selectedRadio.prop('checked', true);
    if (selectedStatus === 'Female') {
      document.querySelector("#profileImg").src = 'https://i.pinimg.com/564x/3f/4b/cd/3f4bcd8a42877276895c8faf702f5773.jpg';
    }

  });
  // updation for adding address
  $("#userAddress").submit(function (event) {
    event.preventDefault();
    let unindexed_array = $(this).serializeArray();
    let data = {};

    $.map(unindexed_array, function (n, i) {
      data[n['name']] = n['value'];
    });
    // Extract the admin's ID from the form data
    const userId = data.id;
    // Validation: Check if the name and email fields are empty
    if (!data.fullName) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your name!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (data.fullName.length < 3) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Name should have at least 3 characters!',
        confirmButtonColor: '#15877C',
      })
      return
    }
    if (!data.phone) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your phone Number!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (data.phone.length !== 10) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter Valid Phone Number!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (!data.address) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your  Address!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (!data.city) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your City!',
        confirmButtonColor: '#15877C',
      })
      return
    }
    if (!data.district) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your District!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (!data.state) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please select your State!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (!data.pincode) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your Pincode!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (data.pincode.length !== 6) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter Valid Pincode!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    let request = {
      "url": `http://localhost:8080/address/${userId}`,
      "method": "PUT",
      "data": data
    };
    // Send the PUT request
    $.ajax(request).done(function (response) {
      Swal.fire({
        icon: 'success',
        title: 'Athenuam',
        text: 'New Address data is inserted Successfully',
        showConfirmButton: true,
        confirmButtonColor: '#15877C',
      }).then((result) => {
        window.location.href = '/profile';
      })
    });
  });

  // updating address
  $("#userAddressEdit").submit(function (event) {
    event.preventDefault();
    let unindexed_array = $(this).serializeArray();
    let data = {};

    $.map(unindexed_array, function (n, i) {
      data[n['name']] = n['value'];
    });
    // Extract the admin's ID from the form data
    const addressId = data.id;
    // Validation: Check if the name and email fields are empty
    if (!data.fullName) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your name!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (data.fullName.length < 3) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Name should have at least 3 characters!',
        confirmButtonColor: '#15877C',
      })
      return
    }
    if (!data.phone) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your phone Number!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (data.phone.length !== 10) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter Valid Phone Number!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (!data.address) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your  Address!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (!data.city) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your City!',
        confirmButtonColor: '#15877C',
      })
      return
    }
    if (!data.district) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your District!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (!data.state) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please select your State!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (!data.pincode) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your Pincode!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (data.pincode.length !== 6) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter Valid Pincode!',
        confirmButtonColor: '#15877C',
      })
      return;
    }

    let request = {
      "url": `http://localhost:8080/addresses/${addressId}`,
      "method": "PUT",
      "data": data
    };
    // Send the PUT request
    $.ajax(request).done(function (response) {
      Swal.fire({
        title: 'Athenuam',
        text: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
        confirmButtonColor: '#15877C'
      })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            Swal.fire({
              icon: 'success',
              title: 'Athenuam',
              confirmButtonColor: '#15877C',
              text: 'Data updated successfully',
            }).then((result) => {
              window.location.href = '/profile';
            })
          } else if (result.isDenied) {
            Swal.fire({
              icon: 'info',
              title: 'Athenuam',
              text: 'Changes are not saved',
              confirmButtonColor: '#15877C',
            })
              .then((result) => {
                window.location.href = '/profile';
              })
          }
        })
    });
  });

  if (window.location.pathname === "/profile") {
    $(document).on("click", ".addressCard .card-body .addressFooter a.delete", function (event) {
      event.preventDefault();
      const id = $(this).attr('data-id');
      const request = {
        "url": `http://localhost:8080/profile/${id}`,
        "method": "PUT"
      };
      Swal.fire({
        title: 'Atheneuam',
        text: 'Do you really want to delete this record?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'cancel',
        confirmButtonColor: '#d33',
      })
        .then((result) => {
          if (result.isConfirmed) {
            // The user clicked the "Yes, delete it" button
            $.ajax(request).done(function (response) {
              Swal.fire({
                icon: 'success',
                title: 'Atheneuam',
                text: 'Data deleted Successfully',
                confirmButtonColor: '#15877C'
              }).then(() => {
                location.reload();
              });
            });
          } else {
            // The user clicked the "cancel" button or closed the dialog
            Swal.fire({
              icon: 'info',
              title: 'Atheneuam',
              text: 'Action canceled',
              confirmButtonColor: '#15877C'
            });
          }
        });
    })
  }

  // ***********************Wishlist Section*******************************
  $('.icon-wishlist').on('click', function () {
    $(this).toggleClass('in-wishlist');
  });

  // ***********************Checkout Section*******************************
  $('.adrSelection').on('click', function () {
    // Assuming you have a data attribute on the button containing the address information
    const addressData = $(this).data('address');
    $('#fname').val(addressData.fullName);
    $('#phone').val(addressData.phone);
    $('#adr').val(addressData.address);
    $('#city').val(addressData.city);
    $('#district').val(addressData.district);
    $('#state').val(addressData.state);
    $('#pincode').val(addressData.pincode);
    $('#shippingId').val(addressData._id);
  });

  $("#shippingAdr").submit(function (event) {
    event.preventDefault();
    let unindexed_array = $(this).serializeArray();
    let data = {};

    $.map(unindexed_array, function (n, i) {
      data[n['name']] = n['value'];
    });

    const addressId = data._id;
    // Validation: Check if the name and email fields are empty
    if (!data.fullName) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your name!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (data.fullName.length < 3) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Name should have at least 3 characters!',
        confirmButtonColor: '#15877C',
      })
      return
    }
    if (!data.phone) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your phone Number!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (data.phone.length !== 10) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter Valid Phone Number!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (!data.address) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your  Address!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (!data.city) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your City!',
        confirmButtonColor: '#15877C',
      })
      return
    }
    if (!data.state) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please select your State!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (!data.pincode) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter your Pincode!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (data.pincode.length !== 6) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter Valid Pincode!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    let request = {
      "url": `http://localhost:8080/checkout/${addressId}`,
      "method": "PUT",
      "data": data
    };
    // Send the PUT request
    $.ajax(request).done(function (response) {
      Swal.fire({
        title: 'Athenuam',
        text: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
        confirmButtonColor: '#15877C'
      })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            Swal.fire({
              icon: 'success',
              title: 'Athenuam',
              confirmButtonColor: '#15877C',
              text: 'shipping address is updated successfully',
            }).then((result) => {

              $('#editShipping').css('display', 'none');
              $('.adrSelection').css('display', 'none');
              $('.adrChange').css('display', 'block');
              $('.paymentSection').css('display', 'block');
              $('#checkoutAddBtn').css('display', 'none');
              $('#addressCard').css('display', 'none');
              $('#updatedAddress').css('display', 'block');
              $('#savedId').text(addressId);
              $('#savedName').text(data.fullName);
              $('#savedPhone').text(data.phone);
              $('#savedAddress').text(data.address);
              $('#savedCity').text(data.city);
              $('#savedDistrict').text(data.district);
              $('#savedState').text(data.state);
              $('#savedPin').text(-data.pincode);
            })
          } else if (result.isDenied) {
            Swal.fire({
              icon: 'info',
              title: 'Athenuam',
              text: 'Changes are not saved',
              confirmButtonColor: '#15877C',
            })
              .then((result) => {
                window.location.href = '/checkout';
              })
          }
        })
    });
  });

  $("#changeBtn").click(function () {
    $('#editShipping').css('display', 'block');
    $('.adrSelection').css('display', 'block');
    $('#addressCard').css('display', 'block')
    $('#changeBtn').css('display', 'none');
    $('.paymentSection').css('display', 'none');
    $('#updatedAddress').css('display', 'none');
  });

  $("#couponBtn").submit(function (event) {
    const coupon = $("#coupon").val();
    if (!coupon) {
      Swal.fire({
        title: 'Atheneuam',
        text: 'Please enter coupon code!',
        confirmButtonColor: '#15877C',
      })
      return false;
    } else {
      $('.off').css('display', 'none');
    }
  })


  $("#paymentSection").submit(async function (event) {
    event.preventDefault();
    const shippingId = $("#shippingId").val();
    const paymentMethod = $("input[name='paymentMethod']:checked").val();
    const couponCode = $("input[name='couponCode']").val();
    const amount = Number(document.getElementById('total').innerText.split(" ")[1]);

    if (paymentMethod === undefined) {
      Swal.fire({
        title: 'Athenuam',
        text: 'Please select a payment method',
        showConfirmButton: true,
        confirmButtonColor: '#15877C',
      });
      return false;
    }
    try {
      if (paymentMethod === "Online Payment") {
        const createOrderResponse = await fetch("/createOrder", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amount * 100,
          }),
        });
        if (createOrderResponse.ok) {
          const responseJson = await createOrderResponse.json();
          const orderId = responseJson.orderId;
          const options = {
            "key": "rzp_test_a2pY3SL0qqjGHN",
            "amount": amount * 100,
            "currency": "INR",
            "name": "Atheneuam",
            "description": "Test Transaction",
            "image": "https://asset.cloudinary.com/dfyuibin9/7dfd4f365929133e3282794643564a88",
            handler: async function (response) {
              const checkoutResponse = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  shippingId: shippingId,
                  paymentMethod: paymentMethod,
                  couponCode: couponCode
                }),
              });
              Swal.fire({
                icon: 'success',
                title: 'Athenuam',
                text: 'New Order is Placed Successfully',
                showConfirmButton: true,
                confirmButtonColor: '#15877C',
              }).then(function (result) {
                window.location.href = '/invoice';
              });
              const settings = {
                "url": "/api/payment/verify",
                "method": "POST",
                "timeout": 0,
                "headers": {
                  "Content-Type": "application/json"
                },
                "data": JSON.stringify({ response }),
              };
            },
            "theme": {
              "color": "#15877C"
            },
            "modal": {
              "ondismiss": function () {
                rzp.close();
                Swal.fire({
                  icon: 'error',
                  title: 'Athenuam',
                  text: 'Payment Failed',
                  showConfirmButton: true,
                  confirmButtonColor: '#13877C',
                }).then(() => {
                  window.reload();
                })
              }
            },
          };
          const rzp = new Razorpay(options);
          rzp.open();
        } else {
          console.error('Error creating order:', createOrderResponse.statusText);
          Swal.fire({
            icon: 'error',
            title: 'Athenuam',
            text: 'Error creating order',
            showConfirmButton: true,
            confirmButtonColor: '#FF0000',
          });
        }
      } else {
        // For non-online payment methods
        Swal.fire({
          icon: 'success',
          title: 'Athenuam',
          text: 'New Order is Placed Successfully',
          showConfirmButton: true,
          confirmButtonColor: '#15877C',
        }).then(function (result) {
          window.location.href = '/invoice';
        });
      }


    } catch (error) {
      console.error('An unexpected error occurred:', error);
      Swal.fire({
        icon: 'error',
        title: 'Athenuam',
        text: 'An unexpected error occurred',
        showConfirmButton: true,
        confirmButtonColor: '#15877C',
      });
    }
  });

  // order Cancellation
  $("#cancelOrderForm").submit(function (event) {
    event.preventDefault();
    let unindexed_array = $(this).serializeArray();
    let data = {};
    $.map(unindexed_array, function (n, i) {
      data[n['name']] = n['value'];
    });
    // Extract the user's ID from the form data
    const orderId = data.id;
    let request = {
      "url": `http://localhost:8080/order/${orderId}`,
      "method": "PUT",
      "data": data
    };
    // Send the PUT request
    $.ajax(request).done(function (response) {
      Swal.fire({
        title: 'Athenuam',
        text: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
        confirmButtonColor: '#15877C'
      })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            Swal.fire({
              icon: 'success',
              title: 'Athenuam',
              confirmButtonColor: '#15877C',
              text: 'Data updated successfully',
            }).then((result) => {
              window.location.reload();
            })
          } else if (result.isDenied) {
            Swal.fire({
              icon: 'info',
              title: 'Athenuam',
              text: 'Changes are not saved',
              confirmButtonColor: '#15877C',
            })
              .then((result) => {
                history.back();
              })
          }
        })
    });
  });


  let currentOrderId;
  $('.edit-order-btn').click(function () {
    currentOrderId = $(this).data('order-id');
  });
  // order edit
  $("#editOrderForm").submit(function (event) {
    event.preventDefault();
    let unindexed_array = $(this).serializeArray();
    let data = {};
    $.map(unindexed_array, function (n, i) {
      data[n['name']] = n['value'];
    });
    // Use the stored order ID
    const orderId = currentOrderId;
    alert(orderId);
    let request = {
      "url": `http://localhost:3000/order/${orderId}`,
      "method": "PUT",
      "data": data
    };
    // Send the PUT request
    $.ajax(request).done(function (response) {
      Swal.fire({
        title: 'Athenuam',
        text: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
        confirmButtonColor: '#15877C'
      })
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            Swal.fire({
              icon: 'success',
              title: 'Athenuam',
              confirmButtonColor: '#15877C',
              text: 'Data updated successfully',
            }).then((result) => {
              window.location.reload();
            })
          } else if (result.isDenied) {
            Swal.fire({
              icon: 'info',
              title: 'Athenuam',
              text: 'Changes are not saved',
              confirmButtonColor: '#15877C',
            })
              .then((result) => {
                history.back();
              })
          }
        })
    });
  });




  // ***********************Chart Section*******************************
  // Chart Global Color
  Chart.defaults.color = "#6C7293";
  Chart.defaults.borderColor = "#ffffffff";

  const count = document.getElementById('totals').value;
  const counts = count.split(",").map(Number);
  const amount = document.getElementById('amounts').value;
  const amounts = amount.split(",").map(x => Number(x) / 1000);

  //overall order
  let ctx1 = $("#worldwide-sales").get(0).getContext("2d");
  let myChart1 = new Chart(ctx1, {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [{
        label: "Sales",
        data: counts,
        backgroundColor: "#CCEBD7"
      },
      {
        label: "Revenue",
        data: amounts,
        backgroundColor: "#15877C"
      }]
    },
    options: {
      responsive: true
    }
  });

  // Date range picker
  let start = moment().subtract(29, 'days');
  let end = moment();

  function cb(start, end) {
    $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
  }

  $('#reportrange').daterangepicker({
    startDate: start,
    endDate: end,
    ranges: {
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    }
  }, cb);

  cb(start, end);

  // Total order chart
  const currentData = {
    datasets: [{
      data: [100, 0],
      backgroundColor: [
        '#15877C',
        '#E2E2E2'
      ],
      hoverOffset: 0
    }],
  };

  const centerTextPlugin = {
    beforeDraw: function (chart) {
      if (chart.config.options.centerText) {
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = chart.config.options.centerText.font || '16px roboto';
        ctx.fillStyle = chart.config.options.centerText.color || '#000';
        ctx.fillText(chart.config.options.centerText.text, centerX, centerY);
        ctx.restore();
      }
    }
  };
  const config = {
    type: 'doughnut',
    data: currentData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      centerText: {
        text: '100%',
        font: '16px Roboto',
        color: '#000'
      },
      borderWidth: 0,
      cutout: '80%',
      rotation: 0
    }, plugins: [centerTextPlugin],
  };
  const myChart = new Chart(
    document.getElementById('doughnut'),
    config
  );


  // Delivered order chart
  const totalData = document.getElementById('total-orders').value;
  const deliveredData = document.getElementById('deliveredOrders').value;
  const deliveredOrders = Math.round((deliveredData * 100) / totalData)
  const newData = {
    datasets: [{
      data: [deliveredOrders, 100 - deliveredOrders],
      backgroundColor: [
        '#0E5A6A',
        '#E2E2E2'
      ],
      hoverOffset: 0
    }],
  };

  const centerText66 = {
    beforeDraw: function (chart) {
      if (chart.config.options.centerText) {
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = chart.config.options.centerText.font || '16px roboto';
        ctx.fillStyle = chart.config.options.centerText.color || '#000';
        ctx.fillText(chart.config.options.centerText.text, centerX, centerY);
        ctx.restore();
      }
    }
  };
  const configNew = {
    type: 'doughnut',
    data: newData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      centerText: {
        text: `${deliveredOrders}%`,
        font: '16px Roboto',
        color: '#000'
      },
      borderWidth: 0,
      cutout: '80%',
      rotation: 0
    }, plugins: [centerTextPlugin],
  };
  const newChart = new Chart(
    document.getElementById('doughnut2'),
    configNew
  );


  // Pending Orders
  const pendingOrders = document.getElementById('pendingOrders').value;
  const pending = Math.round((pendingOrders * 100) / totalData)
  const targetData = {
    datasets: [{
      data: [pending, 100 - pending],
      backgroundColor: [
        '#0E5A6A',
        '#E2E2E2'
      ],
      hoverOffset: 0
    }],
  };

  const centerText90 = {
    beforeDraw: function (chart) {
      if (chart.config.options.centerText) {
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = chart.config.options.centerText.font || '16px roboto';
        ctx.fillStyle = chart.config.options.centerText.color || '#000';
        ctx.fillText(chart.config.options.centerText.text, centerX, centerY);
        ctx.restore();
      }
    }
  };
  const target = {
    type: 'doughnut',
    data: targetData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      centerText: {
        text: `${pending}%`,
        font: '16px Roboto',
        color: '#000'
      },
      borderWidth: 0,
      cutout: '80%',
      rotation: 0
    }, plugins: [centerTextPlugin],
  };
  const targetChart = new Chart(
    document.getElementById('doughnut3'),
    target
  );

  // Cancelled order chart
  const cancelledData = document.getElementById('cancelledOrders').value;
  const cancelled = Math.round((cancelledData * 100) / totalData)
  const retargetData = {
    datasets: [{
      data: [cancelled, 100 - cancelled],
      backgroundColor: [
        '#6CCCC3',
        '#E2E2E2'
      ],
      hoverOffset: 0
    }],
  };

  const centerText30 = {
    beforeDraw: function (chart) {
      if (chart.config.options.centerText) {
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = chart.config.options.centerText.font || '16px roboto';
        ctx.fillStyle = chart.config.options.centerText.color || '#000';
        ctx.fillText(chart.config.options.centerText.text, centerX, centerY);
        ctx.restore();
      }
    }
  };
  const Retarget = {
    type: 'doughnut',
    data: retargetData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      centerText: {
        text: `${cancelled}%`,
        font: '16px Roboto',
        color: '#000'
      },
      borderWidth: 0,
      cutout: '80%',
      rotation: 0
    }, plugins: [centerTextPlugin],
  };
  const retargetChart = new Chart(
    document.getElementById('doughnut4'),
    Retarget
  );

  // Salse & Revenue Chart
  const dates = document.getElementById('dates').value;
  const date = dates.split(",").map(Number);
  const dailyOrders = document.getElementById('dailyOrders').value;
  const dailyOrder = dailyOrders.split(",").map(Number);

  const dailyCarts = document.getElementById('dailyCart').value;
  const dailyCart = dailyCarts.split(",").map(Number);

  const ctx2 = $("#salse-revenue").get(0).getContext("2d");
  const myChart2 = new Chart(ctx2, {
    type: "line",
    data: {
      labels: date,
      datasets: [{
        label: "Order",
        data: dailyOrder,
        backgroundColor: "rgba(21, 135, 124, .9)",
        fill: true
      },
      {
        label: "Cart",
        data: dailyCart,
        backgroundColor: "rgba(21, 135, 124, .5)",
        fill: true
      }
      ]
    },
    options: {
      responsive: true
    }
  });





})(jQuery);


