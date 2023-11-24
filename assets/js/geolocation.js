// 
    
// // function showPosition(position) {
// //     const latitude = position.coords.latitude;
// //     const longitude = position.coords.longitude;

// //     // For example, you could update the value of the input field with the obtained coordinates:
// //     document.getElementById("address").value = "Latitude: " + latitude + ", Longitude: " + longitude;
// // }


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
//     const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAFROiwMjkH3tIvHePQEwlzOkQ3bUkPZ7E`;

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




// const x = document.getElementById("address");

// // function getLocation() {
// //   if (navigator.geolocation) {
// //     navigator.geolocation.watchPosition(showPosition);
// //   } else { 
// //     swal.fire({
// //         title: "Geolocation is not supported by this browser.",
// //         confirmButtonColor: "#3085d6",
// //     })
// //   }
// // }
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
// This function is called when the user clicks the UI button requesting
// a geocode of a place ID.
function geocodePlaceId(geocoder, map, infowindow) {
  const placeId = document.getElementById("place-id").value;

  geocoder
    .geocode({ placeId: placeId })
    .then(({ results }) => {
      if (results[0]) {
        map.setZoom(11);
        map.setCenter(results[0].geometry.location);

        const marker = new google.maps.Marker({
          map,
          position: results[0].geometry.location,
        });

        infowindow.setContent(results[0].formatted_address);
        infowindow.open(map, marker);
      } else {
        window.alert("No results found");
      }
    })
    .catch((e) => window.alert("Geocoder failed due to: " + e));
}

window.getLocation = getLocation;