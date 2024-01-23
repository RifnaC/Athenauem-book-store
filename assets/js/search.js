const searchBarContainerEl = document.querySelector(".search-bar-container");

const magnifierEl = document.querySelector(".magnifier");
const spaces = document.querySelectorAll(".space");

magnifierEl.addEventListener("click", () => {
  searchBarContainerEl.classList.toggle("active");
  spaces.forEach((space) => space.classList.toggle("active"));
});


function bannerShopNow(type, product, genre){
  if(type == "category"){
    window.location.href = '/category#' +genre;
  }else{
    window.location.href = '/productView/' +product;
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