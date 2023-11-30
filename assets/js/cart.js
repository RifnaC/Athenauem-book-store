// cart quantity 
function changeQty(cartId, productId, count, subTotal) {
    $.ajax({
      url:'/changeInQuantity',
      data:{
        cartId: cartId,
        productId: productId,
        count: count,
        subTotal: subTotal,
      },
      method: 'POST',
      success: (data) => {
        window.location.reload();
      }
    })
}
//  disabling the decrement button when quantity is less than 1
// $(document).ready(function () {
//     const quantity = parseInt($('.input-qty').val()); // Parse the quantity as an integer
//     const decBtn = $('#decBtn-{{this._id}}');

//     if (quantity < 1) {
//         decBtn
//     }
// });

// Function to change cart quantity
function changeQty(cartId, productId, count, subTotal) {
    $.ajax({
        url: '/changeInQuantity',
        data: {
            cartId: cartId,
            productId: productId,
            count: count,
            subTotal: subTotal,
        },
        method: 'POST',
        success: (data) => {
            window.location.reload();
        }
    });
}

// Function to disable the decrement button when quantity is less than or equal to 1


// Call the disableDecrementButton function after each AJAX request
$(document).ajaxComplete(function () {
    disableDecrementButton();
});



