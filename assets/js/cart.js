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
// Function to change cart quantity
function removeItem(cartId, productId) {
    $.ajax({
        url: '/removeItem',
        data: {
            cartId: cartId,
            productId: productId,
        },
        method: 'POST',
        success: (data) => {
            if (data.success) {
                // alert('Successfully removed item from cart!');
                Swal.fire({
                    title:'Atheneuam',
                    text:'Item removed successfully!',
                    confirmButtonColor: '#15877C',
                })
            }
            // window.location.reload();
        }
    })
}
// disable the decrement button when the quantity is less than one
$(document).ready(() => {
    $('.input-qty').each(function() {
        const quantity = parseInt($(this).val());

        if (quantity <= 1) {
            $(this).siblings('#decBtn').prop('disabled', true);
        }
    });
});





