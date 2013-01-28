 

var extensionid = "O7WRSFR9ABNOWYFMHRFT4RXLF";


//see if uniqid has been created for user
if (localStorage.getItem('uniqid') === null){
	// if not, create unique id and store in local store
	var uniqid = uniqueid();
	localStorage.setItem('uniqid', uniqid);
	
} else {
	// if yes, retrieve value
	var uniqid = localStorage.getItem('uniqid')	;
}


chrome.extension.onMessage.addListener(
		  function(request, sender, sendResponse) {
		   
			var message = request.value;
			var dataToSend = new FormData(); // create a new FormData object
			var xhr = new XMLHttpRequest();
			
			xhr.open("POST", 'http://www.miidi.org/cito/api/listen.php');
	
			dataToSend.append('triple',  uniqid + "|" + message + "|" + extensionid); // add data to the object
			xhr.send(dataToSend);
			/*
			 xhr.addEventListener("load", function(e) {
			   }, false)
		 	sendResponse({reply : message});
			    */
			
		          });
		              

		    
		      

		    
		      
function uniqueid(){
    // always start with a letter (for DOM friendlyness)
    var idstr=String.fromCharCode(Math.floor((Math.random()*25)+65));
    do {                
        // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
        var ascicode=Math.floor((Math.random()*42)+48);
        if (ascicode<58 || ascicode>64){
            // exclude all chars between : (58) and @ (64)
            idstr+=String.fromCharCode(ascicode);    
        }                
    } while (idstr.length<32);

    return (idstr);
}





		 