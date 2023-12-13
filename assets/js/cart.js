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
function addToCart(){
    Swal.fire({
        icon:'success',
        title:'Atheneuam',
        text:'Item added to cart successfully!',
        confirmButtonColor: '#15877C',
    });
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
                // alert('Successfully removed item from cart!', data);
                Swal.fire({
                    title:'Atheneuam',
                    text:'Item removed successfully!',
                    confirmButtonColor: '#15877C',
                });
                window.location.reload();
            }
        }
    })
}

// remove item from the wishlist
function removeWishlistItem(wishlistId, productId) {
    $.ajax({
        url: '/wishlists',           
        data: {
            wishlistId: wishlistId,
            productId: productId,
        },
        method: 'PUT',
        success: (data) => { 
            Swal.fire({
                position:"top-end",
                text:'Product removed successfully from wishlist!',
                showConfirmButton:false,
                timer:3000,
            }).then(() => {
                window.location.reload();
            });              
        }
    })
}

function clearWishlist(){
    $.ajax({
        url: '/clearWishlist',
        method: 'PUT',
        success: (data) => {
            Swal.fire({
                title: 'Atheneuam',
                text: 'Do you really want to clear your wishlist?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'cancel',
                confirmButtonColor: '#15877C',
            }).then((result) => {
                if (result.isConfirmed) {
                    // The user clicked the "Yes, delete it" button
                    $.ajax(request).done(function (response) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Atheneuam',
                            confirmButtonColor: '#15877C',
                            text: 'Wishlist cleared Successfully',
                        }).then(() => {
                            window.location.href= ''
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
        }
    })
}
   
