
window.onload = function() {
	getCurrentPosition();
	showDisclaimer();
}

function getCurrentPosition() {
	if ("geolocation" in navigator) {
		var geoOpts = {
			    enableHighAccuracy: true,
			    maximumAge        : 60000,
			    timeout           : 20000
		    };

		navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOpts);

	} else {
  	// TODO: Handle by displaying a form to enter zip code, with link to retry for geolocation
  	console.log("Geolocation not supported.")
	}
}

// Send coordinates to server to display results, either by AJAX or Form Submission
function geoSuccess(position) {
  var data = { latitude: position.coords.latitude, longitude: position.coords.longitude },
      XHR = new XMLHttpRequest(),
      urlEncodedData = "",
      urlEncodedDataPairs = [],
      name;

  // We turn the data object into an array of URL encoded key value pairs.
  for(name in data) {
    urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
  }

  // We combine the pairs into a single string and replace all encoded spaces to
  // the plus character to match the behaviour of the web browser form submit.
  urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

  // We define what will happen if the data is successfully sent
  XHR.addEventListener('load', function(event) {
  	console.log("response loaded");

  	/*
     * Updates the DOM.
     *
     * TODO: Do in vanilla JS
     * TODO: Do not replace entire DOM, only everything under the Nav
  	 */
    $("html").html(XHR.responseText);

    // document.open();
		// document.write(XHR.responseText);
		// document.close();
  });

  // We define what will happen in case of error
  XHR.addEventListener('error', function(event) {
    console.error('Error sending data.');
  });

  // We setup our request
  XHR.open('POST', '/');

  // We add the required HTTP header to handle a form data POST request
  XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  // And finally, We send our data.
  XHR.send(urlEncodedData);
}

function geoError() {
	// TODO: Handle by displaying a form to enter zip code, with link to retry for geolocation
	console.log("Error getting current position.");
}

function showDisclaimer() {
	document.getElementsByClassName('disclaimer')[0].style.display='block';

	var geoLocationLink = document.getElementsByClassName('geolocation')[0];
	geoLocationLink.innerText = 'Get My Location';
	geoLocationLink.addEventListener("click", function() {
		getCurrentPosition();
	});
}

