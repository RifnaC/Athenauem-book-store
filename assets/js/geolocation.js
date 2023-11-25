const x = document.getElementById("address");

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
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`

    fetch(url).then(response => response.json()).then(data => {
        x.value =data.display_name.split(",").slice(0, -2);
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


