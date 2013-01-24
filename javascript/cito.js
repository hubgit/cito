
addOnloadEvent(cito);

// COUNTERS
var cnt = 0; // counter used to assign unique id to each CiTO term span tag
var ref = 0; // counter to track reference number


var url = window.location.href;
var  subject = "<" + url + ">"  ;   // citing research article


var scriptsrc = document.getElementById('citojs').src;
var refType = scriptsrc.replace(/.*reftype=/, '');

if (refType == '') {
alert('Please specify a reference list type in your HTML page');	
	
}

 // possible values = reis, pubmed, elife,  plos, zookeys

var predicatePrefix = "http://purl.org/spar/cito/";
var extensionid = "O7WRSFR9ABNOWYFMHRFT4RXLF";

var desc = desc(); // array of descriptions for CiTO
var predicate = predicate(); // value for CiTO predicate URI
var arrCITO = arrCITO();
var arrCITOother = arrCITOother();


var html1 = "<div class='cito-annotate'>" +
"<span class='refTitle'>Why does this article cite that reference? " +
"<span class='refTitleHelp'>(Choose as many reasons as apply by clicking on them.)</span>" +
"</span> " +
"<table class='tblannotate'><tr>";


//from http://www.tek-tips.com/faqs.cfm?fid=4862
function addOnloadEvent(fnc){
	  if ( typeof window.addEventListener != "undefined" )
	    window.addEventListener( "load", fnc, false );
	  else if ( typeof window.attachEvent != "undefined" ) {
	    window.attachEvent( "onload", fnc );
	  }
	  else {
	    if ( window.onload != null ) {
	      var oldOnload = window.onload;
	      window.onload = function ( e ) {
	        oldOnload( e );
	        window[fnc]();
	      };
	    }
	    else 
	      window.onload = fnc;
	  }
	}



function cito(){
	
	if (refType == 'elife') {			
		addHTML4elife();	
	}

	else if (refType == 'pubmed') {
		addHTML4pubmed();		
	}
	else if (refType == 'reis') {
		addHTML4reis();	
	}
	
	else if (refType == 'plos'){
		addHTML4plos();	
	}
	else if (refType == 'zookeys'){
	
		addHTML4zookeys();	
	}
		
	addEventListeners();	
}





function addHTML4plos(){
	

	var referenceList = document.getElementById('references');

	if (referenceList) {
	// iterate through li tags in reference list
	var el=referenceList.getElementsByTagName("li");
	for (var y = 0; y < el.length; y++){
		
			 var html = html1;
			
			 ref += 1; // increment counter
			 html += spanCITO(arrCITO, el[y]); // add CiTO terms
			 html += "</tr></table>";
			 html += "<div id='otherReasons" + ref +"' class='otherReasons'><span class='refTitle'>Other Reasons</span>" +
			 		"<table class='tblannotate'><tr>"; // alternative reasons
			 html += spanCITO(arrCITOother, el[y]); // add CiTO for other reasons
			 html += "</tr></table>" +
			 		"</div></div>";
	    	el[y].innerHTML +=  html;
	    	
	}}
	
}



function addHTML4zookeys(){
	
	
	var referenceList = document.getElementsByClassName('referencesText');

	if (referenceList) {
	// iterate through li tags in reference list
	var el=referenceList[0].getElementsByClassName("referenceRow");
	for (var y = 0; y < el.length; y++){
		
			 var html = html1;
			
			 ref += 1; // increment counter
			 html += spanCITO(arrCITO, el[y]); // add CiTO terms
			 html += "</tr></table>";
			 html += "<div id='otherReasons" + ref +"' class='otherReasons'><span class='refTitle'>Other Reasons</span>" +
			 		"<table class='tblannotate'><tr>"; // alternative reasons
			 html += spanCITO(arrCITOother, el[y]); // add CiTO for other reasons
			 html += "</tr></table>" +
			 		"</div></div>";
			 
			 
	    	el[y].innerHTML +=  html;
	    	
	}}
	
}






function addHTML4reis(){
	

	var referenceList = document.getElementById('references');

	if (referenceList) {
	// iterate through li tags in reference list
	var el=referenceList.getElementsByTagName("li");
	for (var y = 0; y < el.length; y++){
		
			 var html = html1;
			
			 ref += 1; // increment counter
			 html += spanCITO(arrCITO, el[y]); // add CiTO terms
			 html += "</tr></table>";
			 html += "<div id='otherReasons" + ref +"' class='otherReasons'><span class='refTitle'>Other Reasons</span>" +
			 		"<table class='tblannotate'><tr>"; // alternative reasons
			 html += spanCITO(arrCITOother, el[y]); // add CiTO for other reasons
			 html += "</tr></table>" +
			 		"</div></div>";
	    	el[y].innerHTML +=  html;
	    	
	}}
	
}


function addHTML4pubmed(){
	
	
	
	var referenceList = document.getElementById("reference-list");
	// iterate through div tags in page
	var div=referenceList.getElementsByTagName("div");
	for (var y = 0; y < div.length; y++){
		
		 if((div[y].getAttribute('class') == 'ref-cit-blk half_rhythm')|| (div[y].getAttribute('class') == 'ref-cit-blk')){   // if the div contains a reference as identified by class value - insert html
			 var html = html1;
			
			 
			 ref += 1; // increment counter
			 html += spanCITO(arrCITO, div[y]); // add CiTO terms
			 html += "</tr></table>";
			 html += "<div id='otherReasons" + ref +"' class='otherReasons'><span ckass='refTitle'>Other Reasons</span>" +
			 		"<table class='tblannotate'><tr>"; // alternative reasons
			 html += spanCITO(arrCITOother, div[y]); // add CiTO for other reasons
			 html += "</tr></table>" +
			 		"</div></div>";
	    	div[y].innerHTML +=  html;
	 
	    } 
	}


	
	  var l = referenceList.getElementsByTagName("li");
	    for (var z = 0; z < l.length; z++){
	        var html = html1;
	        ref += 1; // increment counter
	         html += spanCITO(arrCITO, l[z]); // add CiTO terms
	        html += "</tr></table>";
	         html += "<div id='otherReasons" + ref +"' class='otherReasons'><span class='refTitle'>Other Reasons</span>" +
	           "<table class='tblannotate'><tr>"; // alternative reasons
	       html += spanCITO(arrCITOother, l[z]); // add CiTO for other reasons
	       html += "</tr></table>" +
	             "</div></div>";
	          l[z].innerHTML +=  html;

	 }
	    }


function addHTML4elife(){
	
	var referenceList = document.getElementById('references');

	if (referenceList) {
	// iterate through li tags in reference list
	var el=referenceList.getElementsByTagName("article");

	for (var y = 0; y < el.length; y++){
		    
			 var html = html1;
			 ref += 1; // increment counter
			 html += spanCITO(arrCITO, el[y]); // add CiTO terms
			 html += "</tr></table>";
			 html += "<div id='otherReasons" + ref +"' class='otherReasons'><span class='refTitle'>Other Reasons</span>" +
			 		"<table class='tblannotate'><tr>"; // alternative reasons
			 html += spanCITO(arrCITOother, el[y]); // add CiTO for other reasons
			 html += "</tr></table>" +
			 		"</div></div>";
	    	el[y].innerHTML +=  html;
	    	
	    console.log(y);
	    	
	}
	}
	
}





function addEventListeners(){	

	// add eventlistener - onclick to save value to external file
	var annotate = document.getElementsByClassName("cito-annotate");

	for (var g = 0; g < annotate.length; g++) {
		var span = annotate[g].getElementsByTagName("span");
		for (var j = 0; j < span.length; j++) {
			
			if (span[j].getAttribute('id') != 'otherreason'){
			span[j].addEventListener("click", function() {
				var title = this.getAttribute('desc');
				var date = new Date();
				 date = date.toUTCString()
				
				if (this.getAttribute('class') == 'tag'){
				var action = 'remove';	
					save(this.getAttribute('id') , '0');
				} else {
					var action = "add";	
					save(this.getAttribute('id') , '1');
				}
				
				var value2send = date + "|" + action + "|" + title;
				var xhr = new XMLHttpRequest(); // supported by all modern browsers including Chrome, Opera, Safari, Firefox, IE7+ - not supported by IE 6 and earlier				
				
				// see if uniqid has been created for user
				if (localStorage.getItem('uniqid') === null){
					// if not, create unique id and store in local store
					var uniqid = uniqueid();
					localStorage.setItem('uniqid', uniqid);
					
					
				} else {
					// if yes, retrieve value
					var uniqid = localStorage.getItem('uniqid')	;
				}
				

				var listen = "http://www.miidi.org/metaquery/listen.php";
				var triple =  uniqid + "|" + value2send + "|" + extensionid ;
				

				 var postData = {url: url, triple: triple};
				
				
				 //console.log(url);
				
				 $.ajax({
					    type: 'POST',
					    url: listen,
					    crossDomain: true,
					    data: postData,
					    dataType: 'json',
					    success: function(responseData, textStatus, jqXHR) {
					        console.log('success responseData:' + responseData + ' textstatus: ' + textStatus + 'jqXHR:' + jqXHR);
					    },
					    error: function (responseData, textStatus, errorThrown) {
					        console.log('error responseData:' + responseData + ' errorThrown:' + errorThrown + 'textStatus:' + textStatus);
					    }
					});
					
			});	
			}}}


}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	 

function spanCITO(arrCITO, obj){
	
	html ="";
	
	// iterate through array of CiTO terms to be displayed initially	 
	for (var i = 0; i < arrCITO.length; i++) {
		
		//create table cell
		 html = html + "<td>";
		  var arrCol = arrCITO[i];
		  // iterate through CiTO terms to be displayed in this column
		  for (var j = 0; j < arrCol.length; j++) {
			  // extract property value for CiTO - to be displayed as text
			  var property = arrCol[j];
			 
			  // treat 'OTHER REASON' differently - this will allow user to display/hide additional CiTO terms
			  if (property == 'OTHER REASON') {
				  var html = html + "<span id='otherreason' class='tag'  " +
				  		"onClick='if (document.getElementById(&quot;otherReasons" + ref +"&quot;).className == \"otherReasonsDisplay\") {(document.getElementById(&quot;otherReasons" + ref + "&quot;).className=\"otherReasons\");} else if  ( document.getElementById(&quot;otherReasons" + ref + "&quot;).className == \"otherReasons\") { (document.getElementById(&quot;otherReasons" + ref + "&quot;).className = \"otherReasonsDisplay\");}'><div id='show-other' onClick='if (this.innerHTML == &quot;SHOW OTHER REASONS&quot;){this.innerHTML = &quot;HIDE OTHER REASONS&quot; } else {this.innerHTML= &quot;SHOW OTHER REASONS&quot;}'>SHOW OTHER REASONS</div>" +
				  				"<span style='margin-left:180px;'>Click here to display or hide other reasons</span></span>";	  
				  
			  }
			  else {
				  // define HTML for CiTO term selector - span tag is used with various attributes
				  // define triple values to be inserted into @desc attribute of span
				     var description = desc[property];
					 var pred = "<" + predicatePrefix + predicate[property] + ">"; // relation from CiTO
								 
					 var object = getObject(obj);
					 var triple = subject + "|"  + pred + "|" + object + "\n";
					 var id = 'p' + cnt; // span id - used to store selection locally
					 
					 var key = window.location.href + id;
					 
					 
					 var isSet = localStorage.getItem(key);
					 
					if (isSet == '0') {
						var cl = 'tag';
						
					} else if (isSet == '1'){
						var cl = 'tagSelected';
					} else {
						var cl = 'tag';
					}
						 
						 	var html = html + "<span id='" + id + "' desc='"+ triple +"' class='" + cl + "' onClick='if (this.className == \"tagSelected\") {(this.className=\"tag\");} else if  ( this.className == \"tag\") { (this.className = \"tagSelected\");}'>" + property +  "<span>" + description + "</span></span>";	  
		  
 
		  cnt += 1; // increment counter used to assign unique id to each CiTO term span tag
		  }
			  
		  }
		  html = html + "</td>";	
	}
	
	return html;
}

function getObject(obj){
	
	 // retrieve url or text citation for reference being cited
	 
	if (refType =='elife') {	
		var object = getObject4elife(obj);	
	}

	else if (refType == 'pubmed') {
var object =		getObject4pubmed(obj);		
	}
	else if (refType == 'reis') {
	var object = getObject4reis(obj);	
	} 
	
	else if (refType == 'plos'){
		var object = getObject4plos(obj);	
		}
	
	else if (refType == 'zookeys'){
		var object = getObject4zookeys(obj);	
		}
	
	return object;
	
	
	
}






function getObject4zookeys(el){
	
	
	var regexAHREFmatch = /doi:.*/;
	var regexAHREFreplace = /doi: <a target="_blank" href=".*">|<\/a.*/g;
	
	var citedDoc = el.innerHTML;

	 if (citedDoc.match(regexAHREFmatch) != null){
		 //extractlink
		 var obj = citedDoc.match(regexAHREFmatch) + "";
		 // extract identifier from  link
		 var obj = obj.replace(regexAHREFreplace, "");
		 var obj = "<http://dx.doi.org/" + obj + "> ";
		 	 
	 }
	
	 else {
		 
		 if (el.innerText){
			 	var obj =  el.innerText  ;
				var obj = '"'  + obj + '"';
		 } else {
			 	var obj = '""'; 
		 }
		
	 }
	
	return obj;
	
	
}








function getObject4plos(el){
	
	
	
	
		var regexAHREFmatch = /http.*/;
		var regexAHREFreplace = /\".*$/;
	
	var citedDoc = el.innerHTML;

	 if (citedDoc.match(regexAHREFmatch) != null){
		 //extractlink
		 var obj = citedDoc.match(regexAHREFmatch) + "";
		 // extract identifier from  link
		 var obj = obj.replace(regexAHREFreplace, "");
		 var obj = "<" + obj + "> ";
		 	 
	 }
	
	 else {
		 
		 if (el.innerText){
			 	var obj =  el.innerText  ;
				var obj = '"'  + obj + '"';
		 } else {
			 	var obj = '""'; 
		 }
		
	 }
	
	return obj;
	
	
}









function getObject4reis(el){
	
	var regexINDEXreplace = /^\s*\d*\.\s*/;
	var regexAHREFmatch = /<a.*href=".*">.*<\/a>/;
	var regexAHREFreplace = /<a.*href="|">.*<\/a>/g;
	var citedDoc = el.innerHTML;

	 
	 if (citedDoc.match(regexAHREFmatch) != null){
		 //extractlink
		 var obj = citedDoc.match(regexAHREFmatch) + "";
		 // extract identifier from  link
		 var obj = obj.replace(regexAHREFreplace, "");
		 var obj = "<" + obj + "> ";
		 	 
	 }
	
	 else {
		 
		 if (el.innerText){
			 	var obj =  el.innerText  ;
				var obj = '"'  + obj.replace(regexINDEXreplace, "") + '"';
		 } else {
			 	var obj = '""'; 
		 }
		
	 }
	
	return obj;
	
	
}


function getObject4elife(el){
	 // retrieve url or text citation for reference being cited	
	
	var regexDOImatch = /class="elife-reflink-details-doi"><a.*href="http:\/\/dx\.doi\.org.*"\s*target="_blank"\s*>http:\/\/dx\.doi\.org/;
	var regexDOIreplace = /class="elife-reflink-details-doi"><a.*href="|".*>.*/g;
	
	
	//<a href="/lookup/external-ref/medline?access_num=22301313&amp;link_type=MED" target="_blank">PubMed</a>
	var regexPUBMEDmatch = /elife-reflink-link life-reflink-link-medline">.*PubMed<\/a>/;
	var regexPUBMEDreplace = /.*access_num=|\&.*/g;
	
	
	var regexCROSSREFmatch = /\/lookup\/external-ref\/doi\?access_num=.*>CrossRef<\/a>/;
	var regexCROSSREFreplace = /.*access_num=|\&.*/g;

	//var regexWOSmatch = /<a href="\/lookup\/external-ref\/newisilink?access_num=.*&.*>Web of science<\/a>/;
	//var regexWOSreplace = /<a href="\/lookup\/external-ref\/newisilink?access_num=|&.*>Web of science<\/a>/;
	
	//var regexHIGHWIREmatch = /<a href="\/lookup\/external-ref\/medline\?access_num=17384059&.*>PubMed<\/a>/;
	//var regexHIGHWIREreplace = /<a href="\/lookup\/external-ref\/medline\?access_num=|&.*>PubMed<\/a>/;
	
//	var regexTEXTmatch = /<a href="\/lookup\/external-ref\/medline\?access_num=17384059&.*>PubMed<\/a>/;
//	var regexTEXTreplace = /<a href="\/lookup\/external-ref\/medline\?access_num=|&.*>PubMed<\/a>/;
	
	
	
	var citedDoc = el.innerHTML;

	
	 
	 if (citedDoc.match(regexDOImatch) != null){
		
		 var obj = citedDoc.match(regexDOImatch) + "";
		 
		 // extract identifier from  link
		 var obj = obj.replace(regexDOIreplace, "");
		 var obj = "<" + obj + "> ";
		
		 
	 }
	 
	 else if (citedDoc.match(regexPUBMEDmatch) != null){
		 var obj = citedDoc.match(regexPUBMEDmatch) + "";
		 
		
		 var obj = obj.replace(regexPUBMEDreplace, "");
		 var obj = "<http://www.ncbi.nlm.nih.gov/pubmed?term=" + obj + "%5Buid%5D> ";
		
	 }
	 
	else if (citedDoc.match(regexCROSSREFmatch) != null){
		 var obj = citedDoc.match(regexCROSSREFmatch) + "";
		 
		 
		 var obj = obj.replace(regexCROSSREFreplace, "");
		 var obj = "<http://dx.doi.org/" + obj + "> ";
		 
	 }
	 
	 
	 else {
		 
		
		 if (el.innerText){
			 	var obj =  el.innerText  ;
				var obj =  obj.replace(/^\d*|cited .*/g, "") ;
				var obj = obj.replace(/^\n*|\n*$/g, "") ;
				var obj = '"'  + obj.replace(/\n/g, " ") + '"';
				
		 } else {
			 	var obj = '""'; 
		 }
	 }
	
	return obj;
	
	
}




function getObject4pubmed(obj){
	
	 var object = "";
	 var regexPUBMEDmatch = /<span class="nowrap ref pubmed">\[<a href=".*".*>PubMed<\/a>\]<\/span>/; //extract pubmed link
	 var regexPUBMEDreplace = /\<span class="nowrap ref pubmed">\[<a href="|".*>PubMed<\/a>\]<\/span>/g;  // extract identifier from pubmed link
	 
	 var regexPMCmatch = /<span class="nowrap ref pmc">\[<a class="int-reflink" href=".*">PMC free article<\/a>]<\/span>/ ; //
	 var regexPMCreplace = /<span class="nowrap ref pmc">\[<a class="int-reflink" href="|">PMC free article<\/a>]<\/span>/g;
	 
	 var regexINDEXreplace = /^\s*\d*\.\s*/;
	 
	 
	 var citedDoc = obj.innerHTML;
	 
	 
	 if (citedDoc.match(regexPUBMEDmatch) != null){
		 //extract pubmed link
		 var object = citedDoc.match(regexPUBMEDmatch) + "";
		 // extract identifier from pubmed link
		 var object = object.replace(regexPUBMEDreplace, "");
		 var object = "<http://www.ncbi.nlm.nih.gov" + object + ">";
		 
	 }
	 else if (citedDoc.match(regexPMCmatch) != null){
	 
		 var object = citedDoc.match(regexPMCmatch) + "";
		 var object = object.replace(regexPMCreplace, "");
		 var object = "<http://www.ncbi.nlm.nih.gov" + object + ">";
	 }
	 
	 else {
		 if (obj.innerText){
			 	var object =  obj.innerText  ;
				var object = '"'  + object.replace(regexINDEXreplace, "") + '"';
		 } else {
			 	var object = '""'; 
		 }
		
	 }
	
	return object;
	
}




function save(id, value) {
	  
	  // Check that there's some code there.
	  if (!value) {
	    message('Error: No value specified');
	    return;
	  }
	  // Save it using the Chrome extension storage API.
	  
	  
	  var url = window.location.href;
	  var key = url + id;
	  
	  
	  localStorage.setItem(key,value);
	  

	

	}




/*
var arrCITO = new Array(
		
		"agrees with",   "cites",   "cites as authority", 
		 "cites as data source",   "cites as evidence",   "cites as metadata document",  
		 "cites as recommended reading",   "cites as related",   "cites as source document",   "cites for information", 
		 "compiles",   "confirms",   "contains assertion from",   "corrects",   "credits",   "critiques",  
		 "derides",   "disagrees with",  
		 "discusses",   "disputes",   "documents",   "extends",   "gives background to",   "gives support to", 
		 "has reply",   "includes excerpt from",   "includes quotation from",   "is agreed with by",  
		 "is cited as authority by" , "is cited as data source by", "is cited as evidence by", 
		 "is cited as metadata document by", 
		 "is cited as recommended reading", "is cited as related by", "is cited as source document by",  "is cited by", 
		 "is cited for information by",  "is compiled by",   "is confirmed by",   "is corrected by",   "is credited by",  
		 "is critiqued by",   "is derided by",   "is disagreed with by",   "is discussed by",   "is disputed by",  
		 "is documented by",   "is extended by",   "is parodied by",   "is plagiarized by",   "is qualified by",  
		 "is refuted by",   "is retracted by",   "is reviewed by",   "is ridiculed by",   "is supported by",  
		 "is updated by",   "likes", 
		 "obtains background from",   "obtains support from",   "parodies",   "plagiarizes",   "provides assertion for",  
		 "provides conclusions for",   "provides data for",   "provides excerpt for",   "provides method for",  
		 "provides quotation for",   "qualifies",   "refutes",   "replies to",   "retracts",   "reviews",  
		 "ridicules",   "shares authors with",   "supports",   "updates",   "uses conclusions from",   "uses data from", 
		 "uses method in"
		
);
*/
   	
function desc() {
	


	var desc = new Array();
	desc["cites as authority"] = "The citing entity cites the cited entity as one that provides an authoritative description or definition of the subject under discussion.";
	desc["cites for information"]= "The citing entity cites the cited entity as a source of information on the subject under discussion.";
	desc["corrects"]= "The citing entity corrects statements, ideas or conclusions presented in the cited entity.";
	desc["critiques"]= "The citing entity critiques statements, ideas or conclusions presented in the cited entity.";
	desc["discusses"]= "The citing entity discusses statements, ideas or conclusions presented in the cited entity.";
	desc["extends"]= "The citing entity extends facts, ideas or understandings presented in the cited entity.";
	desc["obtains background from"]= "The citing entity obtains background information from the cited entity.";
	desc["reviews"]= "The citing entity reviews statements, ideas or conclusions presented in the cited entity.";
	desc["updates"]= "The citing entity updates statements, ideas, hypotheses or understanding presented in the cited entity.";
	desc["uses data from"]= "The citing entity describes work that uses data presented in the cited entity.";
	desc["uses method in"]= "The citing entity describes work that uses a method detailed in the cited entity.";


	desc["agrees with"] = "The citing entity agrees with statements, ideas or conclusions presented in the cited entity."; 
	desc["cites as data source"] = "The citing entity cites the cited entity as source of data."; 
	desc["cites as evidence"] = "The citing entity cites the cited entity as source of factual evidence for statements it contains."; 
	desc["cites as metadata document"] = "The citing entity cites the cited entity as being the container of metadata describing the citing entity."; 
	desc["cites as recommended reading"] = "The citing entity cites the cited entity as an item of recommended reading. This property can be used, for example, to describe references in a lecture reading list, where the cited references are relevant to the general topic of the lecture, but might not be individually cited within the text of the lecture. Similarly, it could be used to describe items in a 'Suggested further reading' list at the end of a book chapter."; 
	desc["cites as related"] = "The citing entity cites the cited entity as one that is related."; 
	desc["cites as source document"] = "The citing entity cites the cited entity as being the entity from which the citing entity is derived, or about which the citing entity contains metadata."; 
	desc["compiles"] = "The citing entity is used to create or compile the cited entity.";   
	desc["confirms"] = "The citing entity confirms facts, ideas or statements presented in the cited entity.";
	desc["contains assertion from"] = "The citing entity contains a statement of fact or a logical assertion (or a collection of such facts and/or assertions) originally present in the cited entity. This object property is designed to be used to relate a separate abstract, summary or nanopublication to the cited entity upon which it is based.";

	desc["credits"] = "The citing entity acknowledges contributions made by the cited entity."; 
	desc["derides"] = "The citing entity express contempt for the cited entity.";   
	desc["disagrees with"] = "The citing entity disagrees with statements, ideas or conclusions presented in the cited entity."; 
	desc["disputes"] = "The citing entity disputes statements, ideas or conclusions presented in the cited entity.";   
	desc["documents"] = "The citing entity documents information about the cited entity."; 
	desc["gives background to"] = "The cited entity provides background information for the citing entity.";   
	desc["gives support to"] = "The cited entity provides intellectual or factual support for the citing entity.";  
	desc["has reply"] = "The cited entity evokes a reply from the citing entity.";
	desc["includes excerpt from"] = "The citing entity includes one or more excerpts from the cited entity.";   
	desc["includes quotation from"] = "The citing entity includes one or more quotations from the cited entity."; 
	desc["qualifies"] = "The citing entity qualifies or places conditions or restrictions upon statements, ideas or conclusions presented in the cited entity.";   
	desc["refutes"] = "The citing entity refutes statements, ideas or conclusions presented in the cited entity.";   
	desc["replies to"] = "The citing entity replies to statements, ideas or criticisms presented in the cited entity.";   
	desc["retracts"] = "The citing entity constitutes a formal retraction of the cited entity.";  
	desc["ridicules"] = "The citing entity ridicules the cited entity or aspects of its contents.";   
	desc["shares authors with"] = "The citing entity has at least one author in common with the cited entity.";   
	desc["supports"] = "The citing entity provides intellectual or factual support for statements, ideas or conclusions presented in the cited entity."; 
	desc["uses conclusions from"] = "The citing entity describes work that uses conclusions presented in the cited entity.";

	
	return desc;

}


function predicate(){
	
	

	var predicate = new Array();

	predicate["agrees with"] = "agreesWith"; 

	predicate["cites as authority"] = "citesAsAuthority";
	predicate["cites for information"]= "citesForInformation";
	predicate["corrects"]= "corrects";
	predicate["critiques"]= "critiques";
	predicate["discusses"]= "discusses";
	predicate["extends"]= "extends";
	predicate["obtains background from"]= "obtainsBackgroundFrom";
	predicate["reviews"]= "reviews";
	predicate["updates"]= "updates";
	predicate["uses data from"]= "usesDataFrom";
	predicate["uses method in"]= "usesMethodIn";



	predicate["cites as data source"] = "citesAsDataSource"; 
	predicate["cites as evidence"] = "citesAsEvidence"; 
	predicate["cites as metadata document"] = "citesAsMetadataDocument"; 
	predicate["cites as recommended reading"] = "citesAsRecommendedReading"; 
	predicate["cites as related"] = "citesAsRelated"; 
	predicate["cites as source document"] = "citesAsSourceDocument"; 
	predicate["compiles"] = "compiles";   
	predicate["confirms"] = "confirms";
	predicate["contains assertion from"] = "containsAssertionFrom";

	predicate["credits"] = "credits"; 
	predicate["derides"] = "derides";   
	predicate["disagrees with"] = "disagreesWith"; 
	predicate["disputes"] = "disputes";   
	predicate["documents"] = "documents"; 
	predicate["gives background to"] = "givesBackgroundTo";   
	predicate["gives support to"] = "givesSupportTo";  
	predicate["has reply"] = "hasReply";
	predicate["includes excerpt from"] = "includesExcerptFrom";   
	predicate["includes quotation from"] = "includesQuotationFrom"; 
	predicate["qualifies"] = "qualifies";   
	predicate["refutes"] = "refutes";   
	predicate["replies to"] = "repliesTo";   
	predicate["retracts"] = "retracts";  
	predicate["ridicules"] = "ridicules";   
	predicate["shares authors with"] = "sharesAuthorsWith";   
	predicate["supports"] = "supports"; 
	predicate["uses conclusions from"] = "usesConclusionsFrom";

	
	return predicate;
	
}


function arrCITO(){

	var arrCITO = new Array(		
		  new Array("cites as authority",  "cites for information",  "corrects"),
		  new Array("critiques","discusses", "extends"),
		  new Array("obtains background from",  "reviews","updates") ,
		  new Array( "uses data from",  "uses method in" , "OTHER REASON") 
	);
return arrCITO;
}

function arrCITOother(){
	
	var arrCITOother = new Array(		
			  new Array("agrees with", "cites as data source","cites as evidence", "cites as metadata document","cites as recommended reading","cites as related", "cites as source document"),
			  new Array( "compiles",   "confirms","contains assertion from", "credits","derides",   "disagrees with", "disputes"),
			  new Array( "documents","gives background to",   "gives support to",  "has reply","includes excerpt from",   "includes quotation from", "qualifies"),
			  new Array( "refutes",   "replies to",   "retracts",  "ridicules",   "shares authors with",   "supports","uses conclusions from")	
	);
return arrCITOother;

}





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
    	 
