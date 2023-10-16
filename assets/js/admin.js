
  function validateForm() {
    let name = $("input[name='name']").val();
    let email = $("input[name='email']").val();
    let password = $("input[name='password']").val();
    let confirmPassword = $("input[name='confirmPassword']").val();

    // Get the modal and message element using jQuery
    let modal = $("#myModal");
    let modalMessage = $("#modal-message");

    // Check if name, email, password, and confirmPassword are not empty
    if (name === "" || email === "" || password === "" || confirmPassword === "") {
      modalMessage.text("All fields must be filled out");
      modal.css("display", "block");
      return false;
    }

    if (name.length < 3) {
      modalMessage.text("Name should have at least 3 characters");
      modal.css("display", "block");
      return false;
    }

    if (password.length < 6) {
      modalMessage.text("Passwords should have at least 6 characters");
      modal.css("display", "block");
      return false;
    }

    if (password !== confirmPassword) {
      modalMessage.text("Passwords do not match");
      modal.css("display", "block");
      return false;
    }

    return true;
  }

  // Close the modal when the close button is clicked using jQuery
  $(".close").click(function () {
    $("#myModal").css("display", "none");
  });

