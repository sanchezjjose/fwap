
window.onload = function() {

	if ("geolocation" in navigator) {
		getCurrentPosition();

		document.getElementsByClassName('disclaimer')[0].style.display='block';

  	var geoLocationLink = document.getElementsByClassName('geolocation')[0];
		    geoLocationLink.text = 'Get My Location';

		geoLocationLink.addEventListener("click", function() {
			getCurrentPosition();
		});

	} else {
  	// Not supported, handle by displaying a form to enter zip code
	}

	function getCurrentPosition() {
		navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
	}

	function geoSuccess(position) {
	  console.log(position.coords.latitude, position.coords.longitude);

	  var httpRequest = new XMLHttpRequest();
	  httpRequest.onreadystatechange = alertContents;
    httpRequest.open('POST', '/test');
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    httpRequest.send({ "latitude": 1, "longitude": 2 });

    function alertContents() {
	    if (httpRequest.readyState === 4) {
	      if (httpRequest.status === 200) {
	      	console.log(httpRequest.response);
	      } else {
	        alert('There was a problem with the request.');
	      }
	    }
	  }
	}

	function geoError() {
		// Handle the error

		console.log("Error getting current position.");
	}
}