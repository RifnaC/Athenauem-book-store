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


// const x = document.getElementById("address");

// function getLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition, handleLocationError);
//     } else { 
//         swal.fire({
//             title: "Error", 
//             text: "Geolocation is not supported by this browser.", 
//             confirmButtonColor: "#15877C"
//         });
//     }
// }

// function showPosition(position) {
//     const latitude = position.coords.latitude;
//     const longitude = position.coords.longitude;

//     // Make a reverse geocoding request to get the place name
//     const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&AIzaSyAFROiwMjkH3tIvHePQEwlzOkQ3bUkPZ7E`;

//     fetch(geocodingUrl)
//         .then(response => response.json())
//         .then(data => {
//             if (data.status === "OK") {
//                 const placeName = data.results[0].formatted_address;
//                 x.value = placeName;
//             } else {
//                 swal.fire({
//                     title: "Error", 
//                     text: "Unable to fetch place name.", 
//                     confirmButtonColor: "#15877C"
//                 }); 
//             }
//         })
//         .catch(error => {
//             console.error("Error fetching reverse geocoding data:", error);
//             swal.fire({
//                 title: "Error", 
//                 text: "Error fetching place name.", 
//                 confirmButtonColor: "#15877C"
//             }); 
//         });
// }

// function handleLocationError(error) {
//     switch (error.code) {
//         case error.PERMISSION_DENIED:
//             swal.fire({
//                 title: "Error", 
//                 text: "User denied the request for Geolocation.", 
//                 confirmButtonColor: "#15877C"
//             });
//             break;
//         case error.POSITION_UNAVAILABLE:
//             swal.fire({
//                 title: "Error", 
//                 text: "Location information is unavailable.", 
//                 confirmButtonColor: "#15877C"
//             });
//             break;
//         case error.TIMEOUT:
//             swal.fire({
//                 title: "Error", 
//                 text: "The request to get user location timed out.", 
//                 confirmButtonColor: "#15877C"
//             });
//             break;
//         case error.UNKNOWN_ERROR:
//         default:
//             swal.fire({
//                 title: "Error", 
//                 text: "An unknown error occurred.", 
//                 confirmButtonColor: "#15877C"
//             });
//             break;
//     }
// }

