const searchBarContainerEl = document.querySelector(".search-bar-container");

const magnifierEl = document.querySelector(".magnifier");
const spaces = document.querySelectorAll(".space");

magnifierEl.addEventListener("click", () => {
  searchBarContainerEl.classList.toggle("active");
  spaces.forEach((space) => space.classList.toggle("active"));
});

// login or logout
if (document.cookie.split(';').some((item) => item.trim().startsWith('token='))) {
  document.getElementById("logoutText").innerHTML = "Logout";
  document.getElementById("loginedProfile").style.display = "block";

} else {
  document.getElementById("logoutText").innerHTML = "Login";
  document.getElementById("loginedProfile").style.display = "none";
}

function bannerShopNow(type, product, genre) {
  if (type == "category") {
    window.location.href = '/category#' + genre;
  } else {
    window.location.href = '/productView/' + product;
  }
}



function toggleInnerBox() {
  const innerBox = document.getElementById('inner-box');
  const plusIcon = document.getElementById('plus-icon');

  // Toggle the 'show' class to change the collapse state
  innerBox.classList.toggle('show');

  // Toggle the plus/minus icon
  if (innerBox.classList.contains('show')) {
    plusIcon.classList.remove('fa-plus');
    plusIcon.classList.add('fa-minus');
  } else {
    plusIcon.classList.remove('fa-minus');
    plusIcon.classList.add('fa-plus');
  }
}

function toggleInnerBox1() {
  const innerBox = document.getElementById('inner-box2');
  const plusIcon = document.getElementById('plus-icon1');

  // Toggle the 'show' class to change the collapse state
  innerBox.classList.toggle('show');

  // Toggle the plus/minus icon
  if (innerBox.classList.contains('show')) {
    plusIcon.classList.remove('fa-plus');
    plusIcon.classList.add('fa-minus');
  } else {
    plusIcon.classList.remove('fa-minus');
    plusIcon.classList.add('fa-plus');
  }
}

function toggleInnerBox2() {
  const price = document.getElementById('price');
  const plusIcon = document.getElementById('plus-icon2');

  // Toggle the 'show' class to change the collapse state
  price.classList.toggle('show');

  // Toggle the plus/minus icon
  if (price.classList.contains('show')) {
    plusIcon.classList.remove('fa-plus');
    plusIcon.classList.add('fa-minus');
  } else {
    plusIcon.classList.remove('fa-minus');
    plusIcon.classList.add('fa-plus');
  }
}


function applyFilters() {
  // Gather selected genres
  const selectedGenres = Array.from(document.querySelectorAll('#inner-box input:checked')).map(checkbox => checkbox.value);

  // Gather selected authors
  const selectedAuthors = Array.from(document.querySelectorAll('#inner-box2 input:checked')).map(checkbox => checkbox.value);
  const minPrice = document.getElementById('minPrice').value;
  const maxPrice = document.getElementById('maxPrice').value;

  fetch('/shop-page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      genres: selectedGenres,
      authors: selectedAuthors,
      minPrice: minPrice,
      maxPrice: maxPrice,
    }),
  })
    .then(response => response.json())
    .then(data => {
      updateUI(data);
    })
    .catch(error => {
      console.error('Error applying filters:', error);
    });
}

function updateUI(filteredData) {
  // Assuming there's a container element for displaying books
  const shopProductContainer = document.querySelector('.shopProduct');
  shopProductContainer.innerHTML = '';

  filteredData.forEach(book => {
    const bookElement = document.createElement('div');
    bookElement.classList.add('item', 'col-12', 'col-sm-6', 'col-md-6', 'col-lg-4', 'col-xl-4')
    bookElement.innerHTML = `
      <div class="sq_box shadow">
        <div class="pdis_img">
          <a href="/productView/${book._id}">
            <img src="${book.productImg}">
          </a>
        </div>          
        <h4 class="mb-1">${book.bookName}</h4>
        <p>By ${book.author}</p>
        <div class="price-box mb-2">
          <span> Price <i class="fa fa-inr"></i> ${book.originalPrice} </span>
          <span class="offer-price"> Offer Price <i class="fa fa-inr"></i> ${book.price}</span>
        </div>          
        <div class="btn-box text-center bg-primary ">
            <span class="wishlist singleWishlist" id="singleWishlist-${book._id}">
              <a href="/wishlist/${book._id}" class="wrapper nav-link ">
                <div class="icon-wishlist" id="wishlist-${book._id}"></div>                      
              </a>
            </span>
          </div>
          <div class="bg-danger text-center text-white py-1" id="outOfStock-${book._id}"style="display: none;">Out of Stock</div>
          <a class="text-white btn btn-sm " href="/carts/${book._id}" onclick='return addToCartAndShowAlert("${book._id}")' id="addToCart-${book._id}}" style="border-radius: 0;">
            <i class="fa fa-shopping-cart"></i> Add to Cart
          </a>
          <div class="qty-container mx-auto text-dark home-qty" id="qty-${book._id}" style="display: none;">
            <button class="qty-btn-minus btn-primary px-1" type="button" id="decBtn" onclick="decrementQuantity('${book._id}')"><i class="fa fa-minus"></i>
            </button>
            <input type="text" name="qty" value="1" id="cartQty-${book._id}" class=" text-center w-100" readonly />
            <button class="qty-btn-plus btn-primary px-1" type="button" onclick="incrementQuantity('${book._id}}')  "><i class="fa fa-plus"></i>
            </button>
          </div>
        </div>
      `;
    //   if (book.inWishlist) {
    //   document.getElementById('wishlist-book._id').style.background = "url('data:image/svg+xml,%3Csvg id=\"heart-svg\" viewBox=\"467 392 58 57\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg id=\"Group\" fill=\"none\" fill-rule=\"evenodd\" transform=\"translate(467 392)\"%3E%3Cpath id=\"heart\" d=\"M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z\" fill=\"%2315877C\"/%3E%3C/g%3E%3C/svg%3E')";
    //   document.getElementById('wishlist-book._id').style.height = "48px";
    //   document.getElementById('wishlist-book._id').style.width = "48px";
    //   document.getElementById('wishlist-book._id').style.opacity = "1";
    //   document.getElementById('singleWishlist-book._id').style.marginTop = "-16px";
    //   document.getElementById('singleWishlist-book._id').style.marginRight = "20px";
    // }
    // if (book.quantity == 0 || book.stock == "Out Of Stock") {
    //   document.getElementById("outOfStock-${book._id}").style.display = 'block';
    //   document.getElementById("addToCart-${book._id}").style.display = 'none';
    // }
    // if (book.inCart) {
    //   document.getElementById('addToCart-${book._id}').style.display = 'none';
    //   document.getElementById('qty-${book._id}').style.display = 'flex';
    //   document.getElementById('cartQty-${book._id}').value = book.cartQty ;
    // }
    shopProductContainer.appendChild(bookElement);
  });
}


function resetFilters() {
  // Uncheck all checkboxes
  document.querySelectorAll('#inner-box input:checked').forEach(checkbox => {
    checkbox.checked = false;
  });

  document.querySelectorAll('#inner-box2 input:checked').forEach(checkbox => {
    checkbox.checked = false;
  });

  fetch('/shop-page')
    .then(response => response.json())
    .then(data => {
      // Update the UI with the original data
      updateUI(data);
    })
    .catch(error => {
      console.error('Error resetting filters:', error);
    });
}

// Add this function to your Reset button click event
document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);

// const myModal = document.getElementById('myModal')
// const myInput = document.getElementById('myInput')

// myModal.addEventListener('shown.bs.modal', () => {
//   myInput.focus()
// })