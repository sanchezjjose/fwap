
window.onload = function() {
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
	showLoadingIndicator(true);

	var data = {
		latitude: position.coords.latitude,
		longitude: position.coords.longitude,
		timestamp: new Date().getTime()
	};

	localStorage.setItem("position", JSON.stringify(data));

	sendAjaxRequest(data);
}

function geoError() {
	hideLoadingIndicator();
	handleError();
}

function handleError() {

	// TODO: When error occurs, show message on the home screen, to allow them to try again.
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

function sendAjaxRequest(data) {

	var XHR = new XMLHttpRequest(),
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

  XHR.addEventListener('loadend', function(event) {
  	hideLoadingIndicator();
  });

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

    setFilterEventListeners();
  });

  XHR.addEventListener('error', function(event) {
  	var content = document.getElementsByClassName("content")[0];
  	content.innerHTML = "Error occurred sending coordinates to server."
  });

  /*
   * Setup request, add the required HTTP header to handle a form data POST request,
   * and finally send data to the server.
   */
  XHR.open('POST', '/');
  XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  XHR.send(urlEncodedData);
}

function setFilterEventListeners() {
	var radiusElems = document.querySelectorAll(".radius");

	for (var i = 0; i < radiusElems.length; i++) {

		// TODO: make this event binding delegated
		radiusElems[i].addEventListener("click", function(ev) {
			ev.preventDefault();

			var data = JSON.parse(localStorage.getItem("position"));
			data.radius = this.dataset.meters;

			// TODO: iterate instead
			document.getElementsByClassName('radius')[0].classList.remove("selected");
			document.getElementsByClassName('radius')[1].classList.remove("selected");
			document.getElementsByClassName('radius')[2].classList.remove("selected");
			this.classList.add("selected");

			sendAjaxRequest(data);
		});
	}
}

function showDisclaimer() {
	var disclaimerElem = document.getElementsByClassName('disclaimer')[0];

	if (disclaimerElem) {
		disclaimerElem.style.display='block';

		var geoLocationLink = document.querySelector('.geolocation a');
		geoLocationLink.innerText = 'Find My Events';
		geoLocationLink.addEventListener("click", function(ev) {
			getCurrentPosition();
		});
	}
}

// TODO: Fix this.
var intervalId = intervalId || undefined;

function showLoadingIndicator(isLoading) {
  if (!intervalId) {
  	var buttonElem = document.querySelector(".geolocation a");
  	buttonElem.innerText = "Loading...";

  	intervalId = window.setInterval(function() {
	  	if (buttonElem.innerText.length == 10) {
	  		buttonElem.innerText = "Loading.";
	  	} else {
	  		buttonElem.innerText += ".";
	  	}
	  }, 1000);
  } else {
  	window.clearInterval(intervalId);
  }
}

function hideLoadingIndicator() {
  showLoadingIndicator(false);
}


