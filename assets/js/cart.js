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
            } else {
                Swal.fire({
                    title:'Atheneuam',
                    text:'Item removed successfully!',
                    confirmButtonColor: '#15877C',
                });
            }
            // window.location.reload();
        }
    })
}

$(document).ready(() => {
    const quantity = document.querySelectorAll('.quantity').value;
const decBtn = document.querySelectorAll('.qty-btn-minus');

if(quantity < 1){
    $(".qty-btn-minus").css('display', 'none');
}
})





