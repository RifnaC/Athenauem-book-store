const x = document.getElementById("address");
const  address = document.getElementById("userAddress");
const  city = document.getElementById("cityTown");
const district = document.getElementById("districtRegion");
const state = document.getElementById("selectState");
const pincode = document.getElementById("pincode");


function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition);
  } else { 
    swal.fire({
        title: "Geolocation is not supported by this browser.",
        confirmButtonColor: "#3085d6",
    })
  }
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
    fetch(url).then(response => response.json()).then(data => {
        x.value =data.display_name.split(",").slice(0, -2);
        address.value = x.value;
        // city.value = data.address.city;
        // district.value = data.address.state_district;
        // state.value = data.address.state;
        // pincode.value = data.address.postcode;
        alert(address.value);
        // x.value = (data.address.shop || data.address.suburb || data.address.road) + ", " + data.address.city + ", " + data.address.state;
        console.log(data)
    }).catch(() => {
      swal.fire({
        title: "Error",
        text: "Unable to fetch location!",
        icon: "error",
        confirmButtonColor: "#15877C",
      })
    })

}


