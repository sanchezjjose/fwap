
window.onload = function() {
	getCurrentPosition();
	showDisclaimer();
}

function getCurrentPosition() {
	if ("geolocation" in navigator) {
		var geoOpts = {
			    enableHighAccuracy: true,
			    maximumAge        : 1800000, // 30 minutes
			    timeout           : 20000
		    };

		navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOpts);

	} else {
  	// TODO: Handle by displaying a form to enter zip code, with link to retry for geolocation
  	console.log("Geolocation not supported.")
	}
}

// Send coordinates to server
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
  	
  	var parser = new DOMParser(),
        doc = parser.parseFromString(XHR.responseText, "text/html"),
        responseBody = doc.getElementsByClassName('content')[0];

    var newContainer = document.createElement("div");
    newContainer.setAttribute("class", "container");
		newContainer.appendChild(responseBody);

    var oldContainer = document.getElementsByClassName('container')[0],
        parentElem = oldContainer.parentNode;

    parentElem.replaceChild(newContainer, oldContainer);
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

	// switch(error.code) {
 //    case error.PERMISSION_DENIED:
 //      x.innerHTML = "User denied the request for Geolocation."
 //      break;
 //    case error.POSITION_UNAVAILABLE:
 //      x.innerHTML = "Location information is unavailable."
 //      break;
 //    case error.TIMEOUT:
 //      x.innerHTML = "The request to get user location timed out."
 //      break;
 //    case error.UNKNOWN_ERROR:
 //      x.innerHTML = "An unknown error occurred."
 //      break;
	// 	}
}

function showDisclaimer() {
	var disclaimerElem = document.getElementsByClassName('disclaimer')[0];

	if (disclaimerElem) {
		disclaimerElem.style.display='block';

		var geoLocationLink = document.getElementsByClassName('geolocation')[0];
		geoLocationLink.innerText = 'Get My Location';
		geoLocationLink.addEventListener("click", function() {
			getCurrentPosition();
		});
	}
}
