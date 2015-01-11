
window.onload = function() {
	// getCurrentPosition();
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
  	// TODO: Handle by displaying a form to enter zip code, with link to retry for geolocation.
  	console.log("Geolocation not supported.")
	}
}

// Send coordinates to server.
function geoSuccess(position) {
	showLoadingSpinner();

  var data = { latitude: position.coords.latitude, longitude: position.coords.longitude },
      XHR = new XMLHttpRequest(),
      urlEncodedData = "",
      urlEncodedDataPairs = [],
      name;

  // Turn the data object into an array of URL encoded key value pairs.
  for(name in data) {
    urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
  }

  /*
   * Combine data pairs into a single string, replacing all encoded spaces
   * into a '+' character to match the behaviour of the web browser form submit.
   */
  urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

  XHR.addEventListener('load', function(event) {
  	hideLoadingSpinner();

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

  XHR.addEventListener('error', function(event) {
  	hideLoadingSpinner();

  	var content = document.getElementsByClassName("content")[0];
  	content.innerHTML = "Error occurred sending coordinates to server."
  });

  /* setup request, add the required HTTP header to handle a form data POST request,
   * and finally send data to the server.
   */
  XHR.open('POST', '/');
  XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  XHR.send(urlEncodedData);
}

function geoError() {
	hideLoadingSpinner();

	var content = document.getElementsByClassName("content")[0];

	switch(error.code) {
   case error.PERMISSION_DENIED:
     content.innerHTML = "User denied the request for Geolocation."
     break;
   case error.POSITION_UNAVAILABLE:
     content.innerHTML = "Location information is unavailable."
     break;
   case error.TIMEOUT:
     content.innerHTML = "The request to get user location timed out."
     break;
   case error.UNKNOWN_ERROR:
     content.innerHTML = "An unknown error occurred."
     break;
	}
}

function showDisclaimer() {
	var disclaimerElem = document.getElementsByClassName('disclaimer')[0];

	if (disclaimerElem) {
		disclaimerElem.style.display='block';

		var geoLocationLink = document.querySelector('.geolocation a');
		geoLocationLink.innerText = 'Find My Events';
		geoLocationLink.addEventListener("click", function(ev) {
			ev.preventDefault();
			getCurrentPosition();
		});
	}
}

function showLoadingSpinner() {
	document.getElementById("spinner").className =
   document.getElementById("spinner").className.replace
      ( /(?:^|\s)hide(?!\S)/g , 'show' )
}

function hideLoadingSpinner() {
	document.getElementById("spinner").className =
   document.getElementById("spinner").className.replace
      ( /(?:^|\s)show(?!\S)/g , 'hide' )
}


