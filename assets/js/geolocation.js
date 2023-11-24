// const x = document.getElementById("address");

// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.watchPosition(showPosition);
//   } else { 
//     swal.fire({
//         title: "Geolocation is not supported by this browser.",
//         confirmButtonColor: "#3085d6",
//     })
//   }
// }
    
// function showPosition(position) {
//     const latitude = position.coords.latitude;
//     const longitude = position.coords.longitude;

//     const geocoder = new google.maps.Geocoder();
//     geocoder.geocode({
//       latitude,
//       longitude,
//     }, (results, status) => {
//       if (status === 'OK') {
//         // The results array contains an array of addresses
//         const address = results[0];
//         console.log(address);
//       } else {
//         // An error occurred
//         console.error(status);
//       }
//     });
//     // For example, you could update the value of the input field with the obtained coordinates:
//     document.getElementById("address").value = "Latitude: " + address ;
// }





function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: { lat: 40.731, lng: -73.997 },
  });
  const geocoder = new google.maps.Geocoder();
  const infowindow = new google.maps.InfoWindow();

  document.getElementById("submit").addEventListener("click", () => {
    geocodeLatLng(geocoder, map, infowindow);
  });
}

function geocodeLatLng(geocoder, map, infowindow) {
  const input = document.getElementById("address").value;
  const latlngStr = input.split(",", 2);
  const latlng = {
    lat: parseFloat(latlngStr[0]),
    lng: parseFloat(latlngStr[1]),
  };

  geocoder
    .geocode({ location: latlng })
    .then((response) => {
      if (response.results[0]) {
        map.setZoom(11);

        const marker = new google.maps.Marker({
          position: latlng,
          map: map,
        });

        infowindow.setContent(response.results[0].formatted_address);
        infowindow.open(map, marker);
      } else {
        window.alert("No results found");
      }
    })
    .catch((e) => window.alert("Geocoder failed due to: " + e));
}

window.initMap = initMap;

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
// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(async(showPosition) =>{
//     const latitude = position.coords.latitude;
//     const longitude = position.coords.longitude;

//     const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAFROiwMjkH3tIvHePQEwlzOkQ3bUkPZ7E`);

//     const data = await response.json();
//     console.log(data.address, "address", data);

//     x.value = data.address.City + ',' + data.address.Subregion + ',' + data.address.Region;
//   });

// }



