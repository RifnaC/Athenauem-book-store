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
        title: 'Please enter your name!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (name.length < 3) {
      Swal.fire({
        title: 'Name should have at least 3 characters!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (email === "") {
      Swal.fire({
        title: 'Please enter your email!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (password === "") {
      Swal.fire({
        title: 'Please enter your password!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (confirmPassword === "") {
      Swal.fire({
        title: 'Please enter your  confirm password!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (password.length < 6) {
      Swal.fire({
        title: 'Passwords should have at least 6 characters!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (password !== confirmPassword) {
      Swal.fire({
        title: 'Password and the confirm password should be same!',
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
        title: 'New admin data is inserted Successfully',
        showConfirmButton: false,
        timer: 6000
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
        title: 'Please enter the name!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (data.name.length < 4) {
      Swal.fire({
        title: 'Name should be at least 4 characters',
        confirmButtonColor: '#15877C',
      });
      return;
    }
    if (!data.email) {
      Swal.fire({
        title: 'Please enter the name!',
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
            Swal.fire('Saved!', 'Data updated successfully', 'success')
              .then((result) => {
                window.location.href = '/admin';
              })
          } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info')
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
            Swal.fire('Action canceled', '', 'info');
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
        title: 'Please enter the shop name!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (name.length < 3) {
      Swal.fire({
        title: 'Shop name should have at least 3 characters!',
        confirmButtonColor: '#15877C'
      })
      return false;
    }
    if (address === "") {
      Swal.fire({
        title: 'Please enter the address of shop!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (openingTime === "") {
      Swal.fire({
        title: 'Please enter opening time of the shop!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (closingTime === "") {
      Swal.fire({
        title: 'Please enter closing time of the shop!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (openingTime === closingTime) {
      Swal.fire({
        title: 'Opening time and closing time should not be same!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (shopImg === "") {
      Swal.fire({
        title: 'Please upload shop image!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    return true;
  }

  $("#add_shop").submit(function (event) {
    if (!shopValidation()) {
      event.preventDefault();
    } else {
      Swal.fire({
        icon: 'success',
        title: 'New shop is added Successfully! ',
        showConfirmButton: false,
        timer: 6000,
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
        title: 'Please enter the shop name!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (!formData.get('address')) {
      Swal.fire({
        title: 'Please enter the address of shop!',
        confirmButtonColor: '#15877C',
      })
      return;
    }
    if (!formData.get('openingTime') || !formData.get('closingTime')) {
      Swal.fire({
        title: 'Please enter opening time and closing time of the shop!',
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
          title: 'Do you want to save the changes?',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Save',
          denyButtonText: `Don't save`,
          confirmButtonColor: '#15877C',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire('Saved!', 'Data updated successfully', 'success').then(() => {
              window.location.href = '/shop';
            });
          } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info').then(() => {
              window.location.href = '/shop';
            });
          }
        });
      })
      .fail(function (error) {
        Swal.fire('Error', 'Failed to update data', 'error');
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
            Swal.fire('Action canceled', '', 'info');
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
    let shopId = document.forms["add_product"]["shopId"].value;
    let originalPrice = document.forms["add_product"]["originalPrice"].value;
    let discount = document.forms["add_product"]["discount"].value; 
    let stock = document.forms["add_product"]["stock"].value;
    
    // Check if book details are not empty
    if(shopId === "") {
      Swal.fire({
        title: 'Please select the shop!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (bookName === "") {
      Swal.fire({
        title: 'Please enter book name!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (bookName.length < 4) {
      Swal.fire({
        title: 'Book Name should have at least 4 characters!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if(productImg === " "){
      Swal.fire({
        title: 'Please enter the product image of the book!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (author === "") {
      Swal.fire({
        title: 'Please enter Author field!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (author.length < 4) {
      Swal.fire({
        title: 'Author should have at least 4 characters!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (description === "") {
      Swal.fire({
        title: 'Please provide the decription of the book!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (description.length < 4) {
      Swal.fire({
        title: 'Description should have at least 4 characters!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if(originalPrice === " "){
      Swal.fire({
        title: 'Please enter the original price of the book!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if(discount === " "){
      Swal.fire({
        title: 'Please enter the discount of the book!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if (price === "") {
      Swal.fire({
        title: 'Please enter the price of the Book!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if(stock === " "){
      Swal.fire({
        title: 'Please enter the stock of the book!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    if(productImg === "") {
      Swal.fire({
        title: 'Please provide the image of the book!',
        confirmButtonColor: '#15877C',
      })
      return false;
    }
    return true;
  }
  // Add new book
  $("#add_product").submit(function (event) {
    if (!productValidation()) {
      event.preventDefault();
    } else {
      Swal.fire({
        icon: 'success',
        title: 'New Book is added Successfully',
        showConfirmButton: false,
        timer: 6000
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
    // Validation
    if (!formData.get('bookName')) {
      Swal.fire({
        title: 'Please enter the book name',
        confirmButtonColor: '#15877C'
      })
      return;
    }
    if (formData.get('bookName').length < 4) {
      Swal.fire({
        title: 'The book name should be at least 4 characters',
        confirmButtonColor: '#15877C'
      })
      return;
    }
    if(!formData.get('shopId')){
      Swal.fire({
        title: 'Please select the shop!',
        confirmButtonColor: '#15877C'
      })
      return;
    }
    if (!formData.get('author')) {
      Swal.fire({
        title: 'Please enter Author of the book!',
        confirmButtonColor: '#15877C'
      })
      return;
    }
    if (formData.get('author').length < 4) {
      Swal.fire({
        title: 'The Author should be at least 4 characters',
        confirmButtonColor: '#15877C'
      })
      return;
    } 
    if (!formData.get('description')) {
      Swal.fire({
        title: "Please enter the description of the book",
        confirmButtonColor: '#15877C'
      })
      return;
    }
    if(!formData.get('originalPrice')){
      Swal.fire({
        title: "Please enter the original price of the book",
        confirmButtonColor: '#15877C'
      })
      return;
    
    }
    if(!formData.get('discount')){
      Swal.fire({
        title: "Please enter the discount of the book",
        confirmButtonColor: '#15877C'
      })
      return;
    }
    if(!formData.get('stock')){
      Swal.fire({
        title: "Please enter the stock of the book",
        confirmButtonColor: '#15877C'
      })
      return;
    }
    if (!formData.get('price')) {
      Swal.fire({
        title: "Please enter the price of the book!",
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
            Swal.fire('Saved!', 'Data updated successfully', 'success')
              .then(() => {
                window.location.href = '/products';
              })
          } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info')
              .then(() => {
                window.location.href = '/products';
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

  // Delete the product
  if (window.location.pathname === "/products") {
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
            // The user clicked the "Yes, delete it" button
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
    if (!bannerImg.value && !imgUrl) {
      Swal.fire({
        title: 'Please provide the image of the book banner!',
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
    }
    if (formData.get('type') === 'product') {
      if (!formData.get('productId') || formData.get('productId').length < 4) {
        Swal.fire({
          title: 'Please enter the product ID with at least 4 characters!',
          confirmButtonColor: '#15877C',
        })
        return false;
      }
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
        title: 'Banner Name should have at least six characters!',
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
      location.window.href = '/login';
    }
  })

  $(document).ready(function () {
    $('#categoryTable').DataTable({
        "paging": true,
        "pageLength": 10, 
    });
  });

// $(function () {
//   $(".cardCat").slice(0, 4).show();
//   $(".load-less").css('display', 'none');
//   $("body").on('click touchstart', '.load-more', function (e) {
//     e.preventDefault();
//     $(".cardCat").slideDown();
//     // if ($(".cardCat:hidden").length == 0) {
//       $(".load-more").css('display', 'none');
//       $(".cards").css('width', '90vw');
//       $(".load-less").css('display', 'block');
//       $("#slide-right-container").css('display', 'none');
//     // }
    
//     $('html,body').animate({
  
//       scrollTop: $(this).offset().top
//     }, 1000);
//   });
//   $("body").on('click touchstart', '.load-less', function (e) {
//     e.preventDefault();
//     $(".cardCat:visible").slice(5).slideUp();
//     $(".load-less").css('display', 'none');
//     $(".load-more").css('display', 'block');
//     $("#slide-right-container").css('display', 'block');
//   })
// });


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

  














  // Chart Global Color
  Chart.defaults.color = "#6C7293";
  Chart.defaults.borderColor = "#ffffffff";

  // Worldwide Sales Chart
  let ctx1 = $("#worldwide-sales").get(0).getContext("2d");
  let myChart1 = new Chart(ctx1, {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "March", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [{
        label: "Sales",
        data: [0, 20, 35, 55, 50, 70, 75, 55, 20, 45, 45, 40, 60],
        backgroundColor: "#CCEBD7"
      },
      {
        label: "Target",
        data: [15, 30, 55, 65, 60, 80, 95, 65, 30, 55, 65, 60, 80],
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

  // current customer chart
  const currentData = {
    datasets: [{
      data: [85, 15],
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
        text: '85%',
        font: '16px Roboto',
        color: '#000'
      },
      borderWidth: 0,
      cutout: '80%',
      rotation: 70
    }, plugins: [centerTextPlugin],
  };
  const myChart = new Chart(
    document.getElementById('doughnut'),
    config
  );


  // New customers chart
  const newData = {
    datasets: [{
      data: [66, 34],
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
        text: '66%',
        font: '16px Roboto',
        color: '#000'
      },
      borderWidth: 0,
      cutout: '80%',
      rotation: 70
    }, plugins: [centerTextPlugin],
  };
  const newChart = new Chart(
    document.getElementById('doughnut2'),
    configNew
  );


  // target customers chart
  const targetData = {
    datasets: [{
      data: [90, 10],
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
        text: '90%',
        font: '16px Roboto',
        color: '#000'
      },
      borderWidth: 0,
      cutout: '80%',
      rotation: 70
    }, plugins: [centerTextPlugin],
  };
  const targetChart = new Chart(
    document.getElementById('doughnut3'),
    target
  );

  // Retarget customers chart
  const retargetData = {
    datasets: [{
      data: [30, 70],
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
        text: '30%',
        font: '16px Roboto',
        color: '#000'
      },
      borderWidth: 0,
      cutout: '80%',
      rotation: 70
    }, plugins: [centerTextPlugin],
  };
  const retargetChart = new Chart(
    document.getElementById('doughnut4'),
    Retarget
  );





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





  // $(document).ready(function() {
  //     var ctx = document.getElementById("worldwide-sales").getContext("2d");

  //     // Create the chart data
  //     var data = {
  //       labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  //       datasets: [{
  //         label: "Total Revenue",
  //         data: [10000, 12000, 11000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000],
  //         borderColor: "#3366cc",
  //         backgroundColor: "#3366cc",
  //         fill: false
  //       }]
  //     };

  //     // Create the chart options
  //     var options = {
  //       title: {
  //         text: "Total Revenue"
  //       },
  //       legend: {
  //         display: false
  //       },
  //       scales: {
  //         yAxes: [{
  //           ticks: {
  //             stepSize: 1000
  //           }
  //         }]
  //       }
  //     };

  //     // Create the chart
  //     var chart = new Chart(ctx, {
  //       type: "bar",
  //       data: data,
  //       options: options
  //     });
  //   });






  //    // bar chart data
  //    let ctx1 = $("#worldwide-sales").get(0).getContext("2d");
  // let myChart1 = new Chart(ctx1,  {
  //     labels : ["Jan", "Feb", "March", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  //     datasets : [
  //         {
  //             fillColor : "#15877C",
  //             strokeColor : "#48A4D1",
  //             data: [15, 30, 55, 65, 60, 80, 95, 65, 30, 55, 65, 60, 80]
  //         },
  //         {
  //             fillColor : "rgba(73,188,170,0.4)",
  //             strokeColor : "rgba(72,174,209,0.4)",
  //             data : [364,504,605,400,345,320]
  //         }
  //     ]
  // })
  // // get bar chart canvas
  // // var income = document.getElementById("income").getContext("2d");
  // // // draw bar chart
  // // new Chart(income).Bar(barData);



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


