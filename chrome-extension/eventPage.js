
var extensionid = "O7WRSFR9ABNOWYFMHRFT4RXLF";



chrome.extension.onMessage.addListener(
		  function(request, sender, sendResponse) {

			var message = request.value;
			var dataToSend = new FormData(); // create a new FormData object
			var xhr = new XMLHttpRequest();

			xhr.open("POST", 'http://www.miidi.org/cito/api/listen.php');

			dataToSend.append('triple',   message + "|" + extensionid); // add data to the object
			xhr.send(dataToSend);
			/*
			 xhr.addEventListener("load", function(e) {
			   }, false)
		 	sendResponse({reply : message});
			    */

		          });







