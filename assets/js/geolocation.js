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

    // For example, you could update the value of the input field with the obtained coordinates:
    document.getElementById("address").value = "Latitude: " + latitude + ", Longitude: " + longitude;
}
