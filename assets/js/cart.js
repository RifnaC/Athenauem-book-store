
// cart quantity 
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
        },
    })
}
function addToCartAndShowAlert(productId) {
    const token = document.cookie.split(';').some((item) => item.trim().startsWith('token='));
    if(token){
        Swal.fire({
            position: 'top-end',
            text: 'Successfully added to cart!',
            showConfirmButton: false,
            timer: 1000,
        });
    }
}

function incrementQuantity(productId) {
    const quantityInput = document.querySelector(`#qty-${productId} input[name="qty"]`);
    let currentQuantity = parseInt(quantityInput.value, 10);
    if(currentQuantity < 10){
        quantityInput.value = currentQuantity++;
        // You may also want to update the cart state on the server here
        updateCart(productId, currentQuantity);
    }else{
        Swal.fire({
            position: 'top-end',
            text: 'Maximum quantity reached!',
            showConfirmButton: false,
            timer: 3000,
        }).then(() => {
            updateCart(productId, 10);
        });
    }
}

function decrementQuantity(productId) {
    const quantityInput = document.querySelector(`#qty-${productId} input[name="qty"]`);
    let currentQuantity = parseInt(quantityInput.value, 10);

    // Ensure the quantity doesn't go below 1
    if (currentQuantity > 1) {
        currentQuantity--;
        quantityInput.value = currentQuantity;

        // You may also want to update the cart state on the server here
        updateCart(productId, currentQuantity);
    }else{
        Swal.fire({
            position: 'top-end',
            text: 'Minimum quantity reached!',
            showConfirmButton: false,
            timer: 3000,
        }).then(() => {
            updateCart(productId, 1);
        });
    }
}

function updateCart(productId, quantity,) {
    // Make an AJAX request to the server to update the cart
    $.ajax({
        type: 'POST',
        url: '/carts',
        data: {
            productId: productId,
            quantity: quantity,
        },
        success: function (response) {
            console.log('Cart updated successfully');
            // Handle success, if needed
        },
        error: function (error) {
            console.error('Error updating cart:', error);
            // Handle error, if needed
        }
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
                Swal.fire({
                    position: 'top-end',
                    text: 'Item removed successfully!',
                    showConfirmButton: false,
                    timer: 1000,
                }).then(() => {
                    window.location.reload();
                });
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
                position: "top-end",
                text: 'Product removed successfully from wishlist!',
                showConfirmButton: false,
                timer: 3000,
            }).then(() => {
                window.location.reload();
            });
        }
    })
}

// remove all items from the wishlist
function clearWishlist() {
    $.ajax({
        url: '/clearWishlist',
        method: 'PUT',
        success: (data) => {
            Swal.fire({
                imageUrl: "/img/favicon.png",
                title: "Atheneuam",        
                imageWidth: 120,
                imageHeight: 80,
                imageAlt: "Atheneuam Logo",
                text: 'Do you really want to clear your wishlist?',       
                confirmButtonColor: '#15877C',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'cancel',
            }).then((result) => {
                if (result.isConfirmed) {
                    // The user clicked the "Yes, delete it" button
                    $.ajax(request).done(function (response) {
                        Swal.fire({
                            imageUrl: "/img/favicon.png",
                            title: "Atheneuam",        
                            imageWidth: 120,
                            imageHeight: 80,
                            imageAlt: "Atheneuam Logo",
                            text: 'Wishlist cleared Successfully',
                            confirmButtonColor: '#15877C',
                        });
                    });
                } else {
                    // The user clicked the "cancel" button or closed the dialog
                    Swal.fire({
                        imageUrl: "/img/favicon.png",
                        title: "Atheneuam",        
                        imageWidth: 120,
                        imageHeight: 80,
                        imageAlt: "Atheneuam Logo",
                        text: 'Wishlist Items are not cleared',
                        confirmButtonColor: '#15877C',
                    });
                }
            });
        }
    })
}

function addAllToCart() {
    $.ajax({
        url: '/wishlist',
        method: 'PUT',
        success: (data) => {
            Swal.fire({
                position: 'top-end',
                text: 'All wishlist items are added to cart!',
                showConfirmButton: false,
                timer: 3000,
            }).then(() => {
                window.location.href = '/cart'
            });
        }
    })
}

