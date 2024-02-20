const x = document.getElementById("address");
const  address = document.getElementById("userAddressField");
const  city = document.getElementById("cityTown");
const district = document.getElementById("districtRegion");
const state = document.getElementById("selectState");
const pincode = document.getElementById("pincode");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition);
  } else { 
    swal.fire({
      imageUrl: "/img/favicon.png",
      title: "Atheneuam",        
      imageWidth: 120,
      imageHeight: 80,        
      imageAlt: "Atheneuam Logo",
      text: 'Geolocation is not supported by this browser.',       
      confirmButtonColor: '#15877C',
    });
  }
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
    fetch(url).then(response => response.json()).then(data => {
      if(x){
        return x.value =data.display_name.split(",").slice(0, -2);
      }else{
        address.value = (data.address.shop || data.address.suburb || data.address.road);
        city.value = data.address.city;
        district.value = data.address.state_district;
        state.value = data.address.state;
        pincode.value = data.address.postcode;
      }
    }).catch(() => {
      swal.fire({
        imageUrl: "/img/favicon.png",
        title: "Atheneuam",        
        imageWidth: 120,
        imageHeight: 80,        
        imageAlt: "Atheneuam Logo",
        text: "Unable to fetch location!",       
        confirmButtonColor: '#15877C',
      });
    })

}


