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

  // sweet alerts
  function SweetAlerts(text) {
    Swal.fire({
      imageUrl: "/img/favicon.png",
      title: "Atheneuam",
      imageWidth: 120,
      imageHeight: 80,
      imageAlt: "Atheneuam Logo",
      text: text,
      confirmButtonColor: '#15877C',
    })
  }
  // success sweet alert
  function successAlerts() {
    new Promise((resolve) => {
      Swal.fire({
        imageUrl: "/img/favicon.png",
        title: "Atheneuam",
        imageWidth: 120,
        imageHeight: 80,
        imageAlt: "Atheneuam Logo",
        text: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
        confirmButtonColor: '#15877C',
      }).then((resolve) => {
        if (resolve.isConfirmed) {
          SweetAlerts('Changes are saved');
        } else if (resolve.isDenied) {
          SweetAlerts('Changes are not saved');
        }
      });
    });
  }

  // delete sweet alert
  function deleteAlerts() {
    new Promise((resolve) => {
      Swal.fire({
        imageUrl: "/img/favicon.png",
        title: "Atheneuam",
        imageWidth: 120,
        imageHeight: 80,
        imageAlt: "Atheneuam Logo",
        text: 'Do you really want to delete this record?',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'cancel',
        confirmButtonColor: '#15877C',
      }).then((resolve) => {
        if (resolve.isConfirmed) {
          SweetAlerts('Data deleted successfully');
          window.location.reload();
        } else if (resolve.isDenied) {
          SweetAlerts('Data not deleted');
        }
      });
    });
  }

  //Admin alerts
  // Function to validate the add admin form
  function validateForm() {
    let name = document.forms["uploadUser"]["name"].value;
    let email = document.forms["uploadUser"]["email"].value;
    let password = document.forms["uploadUser"]["password"].value;
    let confirmPassword = document.forms["uploadUser"]["confirmPassword"].value;

    // Check if name, email, password, and confirmPassword are not empty
    if (!name) {
      return SweetAlerts('Please enter the name!');
    }
    if (name.length < 3) {
      return SweetAlerts('Name should have at least 3 characters!');
    }
    if (!email) {
      return SweetAlerts('Please enter the email!');
    }
    if (!password) {
      return SweetAlerts('Please enter the password!');
    }
    if (!confirmPassword) {
      return SweetAlerts('Please enter the confirm password!');
    }
    if (password.length < 6) {
      return SweetAlerts('Password should have at least 6 characters!');
    }
    if (password !== confirmPassword) {
      return SweetAlerts('Password and the confirm password should be same!');
    }
    return true;
  }
  // Add new admin
  $("#uploadUser").submit(function (event) {
    if (!validateForm()) {
      event.preventDefault();
      SweetAlerts('Please enter the details!');
    } else {
      successAlerts();
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
      return SweetAlerts('Please enter the name!');
    }
    if (data.name.length < 4) {
      return SweetAlerts('Name should be at least 4 characters');
    }
    if (!data.email) {
      return SweetAlerts('Please enter the email!');
    }

    let request = {
      "url": `https://${window.location.host}/api/admins/${adminId}`,
      "method": "PUT",
      "data": data
    };
    // Send the PUT request
    $.ajax(request).done(function (response) {
      return successAlerts();
    }).fail(function (error) {
      return SweetAlerts('Failed to update the admin!');
    })
  });

  //delete admin
  if (window.location.pathname === "/admin") {
    $(document).on("click", ".table tbody td a.delete", function (event) {
      event.preventDefault();
      const id = $(this).attr('data-id');
      $.ajax({
        url: `https://${window.location.host}/api/admins/${id}`,
        method: "DELETE",
        success: function (response) {
          // Handle success response
          deleteAlerts();
        },
        error: function (xhr, status, error) {
          SweetAlerts('Failed to delete admin!');
        }
      });
    });
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
      return SweetAlerts('Please enter the name!');
    }
    if (name.length < 3) {
      return SweetAlerts('Shop name should have at least 3 characters!');
    }
    if (address === "") {
      return ("Please enter the address of shop!");
    }
    if (openingTime === "") {
      return ("Please enter opening time of the shop!");
    }
    if (closingTime === "") {
      return ("Please enter closing time of the shop!");
    }
    if (openingTime === closingTime) {
      return ("Opening time and closing time should not be same!");
    }
    if (shopImg === "") {
      return ("Please upload shop image!");
    }
    return true;
  }

  // add shop
  $("#add_shop").submit(function (event) {
    if (!shopValidation()) {
      return SweetAlerts('Please enter the details!');
    } else {
      SweetAlerts('New shop is added Successfully!');
    }
  })

  //update shop details
  $("#edit_shop").submit(function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const shopId = formData.get('id');

    if (!formData.get('name')) {
      return SweetAlerts('Please enter the Shop name!');
    }
    if (!formData.get('address')) {
      return SweetAlerts('Please enter the address of shop!');
    }
    if (!formData.get('openingTime') || !formData.get('closingTime')) {
      return SweetAlerts('Please enter opening time and closing time of the shop!');
    }
    if (formData.get('openingTime') === formData.get('closingTime')) {
      return SweetAlerts('Opening time and closing time of the shop should not be same!');
    }
    if (!formData.get('shopImg')) {
      return SweetAlerts('Please upload shop image!');
    }
    // Append the shopId to the URL
    const request = {
      url: `https://${window.location.host}/api/shops/${shopId}`,
      method: 'PUT',
      data: formData,
      contentType: false, // Required when sending FormData
      processData: false
    };

    $.ajax(request)
      .done(function (response) {
        successAlerts();
      })
      .fail(function (error) {
        SweetAlerts('Failed to update shop!');
      });
  });

  // Delete the shop
  if (window.location.pathname === "/shop") {
    $(document).on("click", ".shopCard a.delete", function (event) {
      event.preventDefault();
      const id = $(this).attr('data-id');
      const url = `https://${window.location.host}/api/shops/${id}`;

      // Send DELETE request using AJAX
      $.ajax({
        url: url,
        method: "DELETE",
        success: function (response) {
          // Handle success response
          deleteAlerts();
        },
        error: function (xhr, status, error) {
          SweetAlerts('Failed to delete shop!');
        }
      });
    });
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
      return SweetAlerts('Please enter book name!');
    }
    if (bookName.length < 4) {
      return SweetAlerts('Book name should have at least 4 characters!');
    }
    if (productImg === " ") {
      return SweetAlerts('Please enter product image!');
    }
    if (author === "") {
      return SweetAlerts('Please enter author!');
    }
    if (author.length < 4) {
      return SweetAlerts('Author should have at least 4 characters!');
    }
    if (description === "") {
      return SweetAlerts('Please enter description!');
    }
    if (description.length < 4) {
      return SweetAlerts('Description should have at least 4 characters!');
    }
    if (originalPrice === " ") {
      return SweetAlerts('Please enter the original price of the book!');
    }
    if (discount === " ") {
      return SweetAlerts('Please enter the discount of the book!');
    }
    if (price === "") {
      return SweetAlerts('Please enter the price of the book!');
    }
    if (stock === " ") {
      return SweetAlerts('Please enter the stock of the book!');
    }
    if (productImg === "") {
      return SweetAlerts('Please provide the image of the book!');
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
    if (!productValidation() || !idFromURL) {
      event.preventDefault();
      SweetAlerts('Please enter book details!');
    } else {
      SweetAlerts('New Book added successfully!');
    }
  });

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
      return SweetAlerts('Please enter book name!');
    }
    if (formData.get('bookName').length < 4) {
      return SweetAlerts('Book name should be at least 4 characters!');
    }
    if (!formData.get('author')) {
      return SweetAlerts('Please enter author of the book!');
    }
    if (formData.get('author').length < 3) {
      return SweetAlerts('Author should be at least 3 characters!');
    }
    if (!formData.get('description')) {
      return SweetAlerts('Please enter description of the book!');
    }
    if (!formData.get('originalPrice')) {
      return SweetAlerts('Please enter the original price of the book!');
    }
    if (!formData.get('discount')) {
      return SweetAlerts('Please enter the discount of the book!');
    }
    if (!formData.get('stock')) {
      return SweetAlerts('Please enter the stock of the book!');
    }
    if (!formData.get('price')) {
      return SweetAlerts('Please enter the price of the book!');
    }
    // Append the bookid to the URL
    const request = {
      'url': `https://${window.location.host}/api/products/${bookId}`,
      'method': 'PUT',
      'data': formData,
      processData: false,
      contentType: false,
    };
    // // Send the PUT request        
    $.ajax(request).done(function (response) {
      successAlerts();
    }).fail(function (response) {
      SweetAlerts('Something went wrong! Please try again.');
    })
  });

  // Delete the product
  if (window.location.pathname === "/products" || window.location.pathname === "/books") {
    $(document).on("click", ".table tbody td a.delete", function (event) {
      event.preventDefault();
      const id = $(this).attr('data-id');
      // Send DELETE request using AJAX
      $.ajax({
        url: `https://${window.location.host}/api/products/${id}`,
        method: "DELETE",
        success: function (response) {
          // Handle success response
          deleteAlerts();
        },
        error: function (xhr, status, error) {
          SweetAlerts('Failed to delete book!');
        }
      });
    });
  }

  // validation for category
  function categoryValidation() {
    let genre = document.forms["add_cat"]["genre"].value;
    let totalBooks = document.forms["add_cat"]["totalBooks"].value;
    let description = document.forms["add_cat"]["description"].value;
    let image = document.forms["add_cat"]["categoryImg"].value;
    // Check if name, email, password, and confirmPassword are not empty
    if (genre === "") {
      return SweetAlerts('Please enter a the category');
    }
    if (genre.length < 4) {
      return SweetAlerts('Category should be at least 4 characters');
    }
    if (totalBooks === "") {
      return SweetAlerts('Please enter a total books');
    }
    if (description === "") {
      return SweetAlerts('Please enter a description of the category');
    }
    if (description.length < 4) {
      return SweetAlerts('Description should be at least 4 characters');
    }
    if (image === "") {
      return SweetAlerts('Please select an image');
    }
    return true;
  }
  // add the category
  $("#add_cat").submit(function (event) {
    if (!categoryValidation()) {
      event.preventDefault();
      SweetAlerts('Please enter category details!');
    } else {
      SweetAlerts('Category added successfully!');
    }
  })

  $("#edit_cat").submit(function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const genreId = formData.get('id');

    if (!formData.get('genre') || formData.get('genre').length < 4) {
      return SweetAlerts('Please enter a category with at least 4 characters!');
    }

    if (!formData.get('totalBooks')) {
      return SweetAlerts('Please enter the total number of books!');
    }

    if (!formData.get('description') || formData.get('description').length < 4) {
      return SweetAlerts('Please enter a description with at least 4 characters!');

    }

    const request = {
      url: `https://${window.location.host}/api/categories/${genreId}`,
      method: 'PUT',
      data: formData,
      processData: false,
      contentType: false,
    };

    $.ajax(request)
      .done(function (response) {
        successAlerts();
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        SweetAlerts('Failed to update data');
      });
  });

  // Delete the category
  if (window.location.pathname === "/category") {
    $(document).on("click", ".table tbody td a.delete", function (event) {
      event.preventDefault();
      const id = $(this).attr('data-id');
      $.ajax({
        url: `https://${window.location.host}/api/categories/${id}`,
        method: "DELETE",
        success: function (response) {
          // Handle success response
          deleteAlerts();
        },
        error: function (xhr, status, error) {
          console.log("XHR status:", xhr.status);
    console.log("Error:", error);
          SweetAlerts('Failed to delete category!');
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
      return SweetAlerts('Please enter banner name!');
    }
    if (name.length < 4) {
      return SweetAlerts('Banner name should have at least 4 characters!');
    }
    if (!shop) {
      return SweetAlerts('Please enter shop name!');
    }
    if (shop.length < 4) {
      return SweetAlerts('Shop name should have at least 4 characters!');
    }
    if (type === 'category') {
      if (!categoryId || categoryId.length < 4) {
        return SweetAlerts('Please enter the category ID with at least 4 characters!');
      }
    }
    if (type === 'product') {
      if (!productId || productId.length < 4) {
        return SweetAlerts('Please enter the product ID with at least 4 characters!');
      }
    }
    if (!bannerImg.value || !imgUrl) {
      return SweetAlerts('Please select an image!');
    }
    if (!desc || desc.length < 4 || desc === null) {
      return SweetAlerts('Please provide the description of the book banner!');
    }
    return true;
  }

  // Create new banner  
  $("#createBanner").submit(function (event) {
    if (!bannerValidation()) {
      event.preventDefault();
      SweetAlerts('Please enter banner details!');
    } else {
      SweetAlerts('Banner created successfully!');
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
      return SweetAlerts('Please enter banner name!');
    }
    if (formData.get('name').length < 4) {
      return SweetAlerts('Banner name should have at least 4 characters!');
    }
    if (!formData.get('shop')) {
      return SweetAlerts('Please enter shop name!');
    }
    if (formData.get('shop').length < 4) {
      return SweetAlerts('Shop name should have at least 4 characters!');
    }

    if (formData.get('type') === 'category') {
      if (!formData.get('categoryId') || formData.get('categoryId').length < 4) {
        return SweetAlerts('Please enter the category ID with at least 4 characters!');
      }
    } else {
      if (!formData.get('productId') || formData.get('productId').length < 4) {
        return SweetAlerts('Please enter the product ID with at least 4 characters!');
      }
    }
    if (!formData.get('description') || formData.get('description').length < 4) {
      return SweetAlerts('Please provide the description of the banner!');
    }
    // Construct the AJAX request object
    let request = {
      "url": `https://${window.location.host}/api/banner/${bannerId}`,
      "method": "PUT",
      "data": formData,  // Use the modified FormData object
      processData: false,
      contentType: false,
    };

    // Send the PUT request
    $.ajax(request).done(function (response) {
      // Display a confirmation SweetAlert
      successAlerts();
    });
  });

  // Delete the Banner
  if (window.location.pathname === "/banner") {
    $(document).on("click", ".banner a.delete", function (event) {
      event.preventDefault();
      const id = $(this).attr('data-id');
      const request = {
        "url": `https://${window.location.host}/api/banner/${id}`,
        "method": "DELETE"
      };
      deleteAlerts();
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
      return SweetAlerts('Please enter your name!')
    }
    if (name.length < 3 || name.length > 16) {
      return SweetAlerts('Please enter a valid name!')
    }
    if (!email) {
      return SweetAlerts('Please enter your email!')
    }
    if (!email.includes('.')) {
      return SweetAlerts('Please Enter a valid email address!');
    }
    if (!pswd) {
      return SweetAlerts('Please enter your password!');
    }
    if (pswd.length < 6) {
      return SweetAlerts('Password should have at least six characters!');
    }
    if (!confirmPswd) {
      return SweetAlerts('Please enter confirm password!');
    }
    if (confirmPswd !== pswd) {
      return SweetAlerts('Password and confirm password should be same!');
    }
    return true;
  }
  // signup
  $("#signup").submit(function (event) {
    if (!signupValidation()) {
      event.preventDefault();
      SweetAlerts('Please enter sign up details!');
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
      return SweetAlerts('Please enter your email!');
    }
    if (!email.includes('.')) {
      return SweetAlerts('Please Enter a valid email address!');
    }
    if (!pswd) {
      return SweetAlerts('Please enter password!');
    }
    if (pswd.length < 6) {
      return SweetAlerts('Password should have at least six characters!');
    }
    return true;
  }
  // login
  $("#login").submit(function (event) {
    if (!loginValidation()) {
      event.preventDefault();
      SweetAlerts('Please enter login details!');
    } else {
      window.location.href = '/login';
    }
  })

  // forgotPassword
  function forgotPassword() {
    const email = document.forms["forgotPswd"]["email"].value;
    if (!email) {
      return SweetAlerts('Please enter your email!');
    }
    if (!email.includes('.')) {
      return SweetAlerts('Please Enter a valid email address!');
    }
    return true;
  }

  $("#forgotPswd").submit(function (event) {
    if (!forgotPassword()) {
      event.preventDefault();
      SweetAlerts('Please enter email details!');
    } else {
      window.location.href = '/reset';
    }
  });

  // otp validation
  function otpValidation() {
    const otp6 = document.forms["otp"]["otp"].value;
    const email = document.forms["otp"]["email"].value;
    if (!otp6) {
      return SweetAlerts('Please enter valid OTP!');
    }
    return true;
  }

  $("#otp").submit(function (event) {
    if (!otpValidation()) {
      event.preventDefault();
      SweetAlerts('Please enter OTP!');
    } else {
      window.location.href = '/reset';
    }
  });

  function resetPassword() {
    const password = document.forms["change_pswd"]["password"].value;
    const confirmPswd = document.forms["change_pswd"]["confirmPswd"].value;

    if (!password || !confirmPswd) {
      return SweetAlerts('Please enter password!');
    }
    if (confirmPswd.length < 6 || password.length < 6) {
      return SweetAlerts('Please enter valid password!');
    }
    if (password !== confirmPswd) {
      return SweetAlerts('Password and confirm password should be same!');
    }
    return true;
  }

  $("#change_pswd").submit(function (event) {
    if (!resetPassword()) {
      event.preventDefault();
      SweetAlerts('Please enter password details!');
    } else {
      window.location.href = '/login';
    }
  });

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
    $(".load-less").hide();

    let originalWidth = $(".cards").width();
    // Handle the "Load More" button click
    $("body").on('click touchstart', '.load-more', function (e) {
      e.preventDefault();
      $(".cardCat:hidden").slideDown();

      // Check if there are no hidden categories
      if ($(".cardCat:hidden").length === 0) {
        $(".load-more").hide()
        $(".cards").css('width', '100vw');
        $(".load-less").show();
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
      $(".load-less").hide();
      $(".load-more").show();;
      $(".cards").css('width', originalWidth);
      $("#slide-right-container").css('display', 'block');

      $('html, body').animate({
        scrollTop: $(this).offset().top
      }, 1000);
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
      return SweetAlerts('Please enter the name!');
    }
    if (data.name.length < 3) {
      return SweetAlerts('Name should be at least 3 characters!');
    }
    if (!data.email) {
      return SweetAlerts('Please enter the email!');
    }
    let request = {
      "url": `https://${window.location.host}/users/${userId}`,
      "method": "PUT",
      "data": data,
    };
    // Send the PUT request
    $.ajax(request).done(function (response) {
      successAlerts();
    }).fail(function (response) {
      SweetAlerts('Something went wrong! Please try again.');
    });
  });

  // Delete the customer
  if (window.location.pathname === "/user") {
    $(document).on("click", ".table tbody td a.delete", function (event) {
      event.preventDefault();
      const id = $(this).attr('data-id');
      $.ajax({
        url: `https://${window.location.host}/users/${id}`,
        method: "DELETE",
        success: function (response) {
          // Handle success response
          deleteAlerts();
        },
        error: function (xhr, status, error) {
          SweetAlerts('Failed to delete customer!');
        }
      });
    });
  }

  // ***********************Offer CRUD Section*******************************
  // add offer
  function offerValidation() {
    let couponCode = document.forms["addCoupon"]["couponCode"].value;
    let expireDate = document.forms["addCoupon"]["expireDate"].value;
    let discount = document.forms["addCoupon"]["discount"].value;

    // Check if couponCode, expireDate and discount are not empty
    if (!couponCode) {
      return SweetAlerts('Please enter coupon code!');
    }
    if (couponCode.length < 3) {
      return SweetAlerts('Coupon Code should have at least 3 characters!');
    }
    if (couponCode !== couponCode.toUpperCase()) {
      return SweetAlerts('Coupon Code Capital letters!');
    }
    if (!expireDate) {
      return SweetAlerts('Please enter expire date!');
    }
    if (!discount) {
      return SweetAlerts('Please enter discount!');
    }
    return true;
  }

  // Add new coupon
  $("#addCoupon").submit(function (event) {
    if (!offerValidation()) {
      event.preventDefault();
      SweetAlerts('Please enter coupon details!');
    } else {
      SweetAlerts('New coupon is created Successfully');
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
      return SweetAlerts('Please enter coupon code!');
    }
    if (data.couponCode.length < 3) {
      return SweetAlerts('Coupon Code should have at least 3 characters!');
    }
    if (data.couponCode !== data.couponCode.toUpperCase()) {
      return SweetAlerts('Coupon Code Capital letters!');
    }
    if (!data.expireDate) {
      return SweetAlerts('Please enter expire date!');
    }
    if (!data.discount) {
      return SweetAlerts('Please enter discount!');
    }

    let request = {
      "url": `https://${window.location.host}/coupon/${couponId}`,
      "method": "PUT",
      "data": data
    };
    // Send the PUT request
    $.ajax(request).done(function (response) {
      successAlerts();
    });
  });

  //delete offer
  if (window.location.pathname === "/offer") {
    $(document).on("click", ".table tbody td a.delete", function (event) {
      event.preventDefault();
      const id = $(this).attr('data-id');
      const request = {
        "url": `https://${window.location.host}/coupon/${id}`,
        "method": "DELETE",
      };
      // The user clicked the "Yes, delete it" button
      $.ajax(request).done(function (response) {
        deleteSuccess();
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
      return SweetAlerts('Please Enter the name!');
    }
    if (data.name.length < 4) {
      return SweetAlerts('Name should be at least 4 characters');
    }
    if (!data.email) {
      return SweetAlerts('Please Enter the email address!');
    }
    if (!data.email.includes('.')) {
      return SweetAlerts('Please Enter a valid email address!');
    }
    if (!data.oldPassword) {
      return SweetAlerts('Please Enter a the old password!');
    }
    if (data.oldPassword < 6) {
      return SweetAlerts('Please Enter valid old password!');
    }
    if (!data.password) {
      return SweetAlerts('Please Enter a the new password!');
    }
    if (data.password < 6) {
      return SweetAlerts('Please Enter valid old password!');
    }
    if (!data.confirmPassword) {
      return SweetAlerts('Please Enter a the new password!');
    }
    if (data.confirmPassword < 6) {
      return SweetAlerts('Please Enter valid old password!');
    }
    if (data.password !== data.confirmPassword) {
      return SweetAlerts('Passwords do not match!');
    }
    let request = {
      "url": `https://${window.location.host}/profiles/${userId}`,
      "method": "PUT",
      "data": data
    };
    // Send the PUT request
    $.ajax(request).done(function (response) {
      successAlerts()
        .then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            SweetAlerts('profile updated successfully').then((result) => {
              window.location.href = '/profile';
            })
          } else if (result.isDenied) {
            SweetAlerts('Changes are not saved')
              .then((result) => {
                window.location.href = '/profile';
              })
          }
        })
    }).fail(() => {
      SweetAlerts('Wrong password! Please enter your correct old password');
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
      return SweetAlerts('Please Enter the name!');
    }
    if (data.fullName.length < 3) {
      return SweetAlerts('Name should have at least 3 characters!');
    }
    if (!data.phone) {
      return SweetAlerts('Please Enter the phone number!');
    }
    if (data.phone.length !== 10) {
      return SweetAlerts('Please Enter a valid phone number!');
    }
    if (!data.address) {
      return SweetAlerts('Please Enter the address!');
    }
    if (!data.city) {
      return SweetAlerts('Please Enter the city!');
    }
    if (!data.district) {
      return SweetAlerts('Please Enter the district!');
    }
    if (!data.state) {
      return SweetAlerts('Please Enter the state!');
    }
    if (!data.pincode) {
      return SweetAlerts('Please Enter the pincode!');
    }
    if (data.pincode.length !== 6) {
      return SweetAlerts('Please Enter a valid pincode!');
    }
    let request = {
      "url": `https://${window.location.host}/address/${userId}`,
      "method": "PUT",
      "data": data
    };
    // Send the PUT request
    $.ajax(request).done(function (response) {
      SweetAlerts('New Address data is inserted Successfully')
        .then((result) => {
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
      return SweetAlerts('Please enter the name!');
    }
    if (data.fullName.length < 3) {
      return SweetAlerts('Name should have at least 3 characters!');
    }
    if (!data.phone) {
      return SweetAlerts('Please enter the phone number!');
    }
    if (data.phone.length !== 10) {
      return SweetAlerts('Please enter a valid phone number!');
    }
    if (!data.address) {
      return SweetAlerts('Please enter the address!');
    }
    if (!data.city) {
      return SweetAlerts('Please enter the city!');
    }
    if (!data.district) {
      return SweetAlerts('Please enter the district!');
    }
    if (!data.state) {
      return SweetAlerts('Please enter the state!');
    }
    if (!data.pincode) {
      return SweetAlerts('Please enter the pincode!');
    }
    if (data.pincode.length !== 6) {
      return SweetAlerts('Please enter a valid pincode!');
    }

    let request = {
      "url": `https://${window.location.host}/addresses/${addressId}`,
      "method": "PUT",
      "data": data
    };
    // Send the PUT request
    $.ajax(request).done(function (response) {
      return successAlerts();
    });
  });

  // address delete
  if (window.location.pathname === "/profile") {
    $(document).on("click", ".addressCard .card-body .addressFooter a.delete", function (event) {
      event.preventDefault();
      const id = $(this).attr('data-id');
      const request = {
        "url": `https://${window.location.host}/profile/${id}`,
        "method": "PUT"
      };
      $.ajax(request).done(function (response) {
        deleteAlerts();
      }).fail(() => {
        SweetAlerts("You have orders from this address.So, this address cannot be deleted!")
      })

    })
  }
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
      "url": `https://${window.location.host}/order/${orderId}`,
      "method": "PUT",
      "data": data
    };
    // Send the PUT request
    $.ajax(request).done(function (response) {
      successAlerts();
    }).fail(() => {
      SweetAlerts('Something went wrong! Please try again.');
    })
  });

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
      return SweetAlerts('Please enter the name!');
    }
    if (data.fullName.length < 3) {
      return SweetAlerts('Name should have at least 3 characters!');
    }
    if (!data.phone) {
      return SweetAlerts('Please enter the phone number!');
    }
    if (data.phone.length !== 10) {
      return SweetAlerts('Please enter a valid phone number!');
    }
    if (!data.address) {
      return SweetAlerts('Please enter the address!');
    }
    if (!data.city) {
      return SweetAlerts('Please enter the city!');
    }
    if (!data.state) {
      return SweetAlerts('Please enter the state!');
    }
    if (!data.pincode) {
      return SweetAlerts('Please enter the pincode!');
    }
    if (data.pincode.length !== 6) {
      return SweetAlerts('Please enter a valid pincode!');
    }
    let request = {
      "url": `/checkout/${addressId}`,
      "method": "PUT",
      "data": data
    };
    // Send the PUT request
    $.ajax(request).done(function (response) {
      Swal.fire({
        imageUrl: "/img/favicon.png",
        title: "Atheneuam",
        imageWidth: 120,
        imageHeight: 80,
        imageAlt: "Atheneuam Logo",
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
              imageUrl: "/img/favicon.png",
              title: "Atheneuam",
              imageWidth: 120,
              imageHeight: 80,
              imageAlt: "Atheneuam Logo",
              confirmButtonColor: '#15877C',
              text: 'Shipping address is updated successfully',
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
            });
          } else if (result.isDenied) {
            Swal.fire({
              imageUrl: "/img/favicon.png",
              title: "Atheneuam",
              imageWidth: 120,
              imageHeight: 80,
              imageAlt: "Atheneuam Logo",
              text: 'Changes are not saved',
              confirmButtonColor: '#15877C',
            })
              .then((result) => {
                window.location.href = '/checkout';
              });
          }
        });
    }).fail(function (response) {
      SweetAlerts("Please Select the your existing shipping address");
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

  // coupon button
  $("#couponBtn").submit(function (event) {
    const coupon = $("#coupon").val();
    if (!coupon) {
      return SweetAlerts('Please enter coupon code!');
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

    if (!paymentMethod) {
      return SweetAlerts('Please select a payment method!');
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
                imageUrl: "/img/favicon.png",
                title: "Atheneuam",
                imageWidth: 120,
                imageHeight: 80,
                imageAlt: "Atheneuam Logo",
                text: 'New Order is Placed Successfully',
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
                  imageUrl: "/img/favicon.png",
                  title: "Atheneuam",
                  imageWidth: 120,
                  imageHeight: 80,
                  imageAlt: "Atheneuam Logo",
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
          SweetAlerts('Error creating order');
        }
      } else {
        // For non-online payment methods
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
          imageUrl: "/img/favicon.png",
          title: "Atheneuam",
          imageWidth: 120,
          imageHeight: 80,
          imageAlt: "Atheneuam Logo",
          text: 'New Order is Placed Successfully',
          confirmButtonColor: '#15877C',
        }).then(function (result) {
          window.location.href = '/invoice';
        });
      }
    } catch (error) {
      return SweetAlerts('An unexpected error occurred');
    }
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
    let request = {
      "url": `https://${window.location.host}/order/${orderId}`,
      "method": "PUT",
      "data": data
    };
    // Send the PUT request
    $.ajax(request).done(function (response) {
      successAlerts();
    }).fail(function (response) {
      SweetAlerts('Error editing order');
    })
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


