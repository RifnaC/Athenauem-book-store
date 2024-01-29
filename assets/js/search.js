const searchBarContainerEl = document.querySelector(".search-bar-container");

const magnifierEl = document.querySelector(".magnifier");
const spaces = document.querySelectorAll(".space");

magnifierEl.addEventListener("click", () => {
  searchBarContainerEl.classList.toggle("active");
  spaces.forEach((space) => space.classList.toggle("active"));
});


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
      bookElement.classList.add('item', 'col-12', 'col-sm-6', 'col-md-6', 'col-lg-4', 'col-xl-4');
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
                  <span class="wishlist singleWishlist">
                      <a href="/wishlist/${book._id}" class="wrapper nav-link ">
                          <div class="icon-wishlist "></div>
                      </a>
                  </span>
              </div>
              <a class="text-white btn btn-sm" href="/carts/${book._id}"
                  onclick='return addToCartAndShowAlert("${book._id}")' id="addToCart-${book._id}">
                  <i class="fa fa-shopping-cart"></i> Add to Cart
              </a>
              <div class="qty-container text-dark home-qty ms-5 ps-2" id="qty-${book._id}">
                  <button class="qty-btn-minus btn-primary" type="button" id="decBtn"
                      onclick="decrementQuantity('${book._id}')"><i class="fa fa-minus"></i>
                  </button>
                  <input type="text" name="qty" value="1" class="text-center w-100" readonly />
                  <button class="qty-btn-plus btn-primary" type="button"
                      onclick="incrementQuantity('${book._id}')"><i class="fa fa-plus"></i>
                  </button>
              </div>
          </div>
      `;
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

const myModal = document.getElementById('myModal')
const myInput = document.getElementById('myInput')

myModal.addEventListener('shown.bs.modal', () => {
  myInput.focus()
})