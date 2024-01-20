const searchBarContainerEl = document.querySelector(".search-bar-container");

const magnifierEl = document.querySelector(".magnifier");
const spaces = document.querySelectorAll(".space");

magnifierEl.addEventListener("click", () => {
  searchBarContainerEl.classList.toggle("active");
  spaces.forEach((space) => space.classList.toggle("active"));
});


function bannerShopNow(type, product, genre){
  alert(type)
  if(type == "category"){
    alert(type + " " + product + " " + genre)
    alert(product);
    alert(genre);
    
  }else{
    window.location.href = '/productView/' +product;
    
  }

  // return false
}

