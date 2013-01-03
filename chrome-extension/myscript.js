
// COUNTERS
var cnt = 0; // counter used to assign unique id to each CiTO term span tag
var ref = 0; // counter to track reference number

var  subject = "<" + window.location.href + ">"  ;   // citing research article
var predicatePrefix = "http://purl.org/spar/cito/";


var desc = desc(); // array of descriptions for CiTO
var predicate = predicate(); // value for CiTO predicate URI
var arrCITO = arrCITO();
var arrCITOother = arrCITOother();

var html1 = "<div class='cito-annotate'>" +
"<span class='refTitle'>Why does this article cite that reference? " +
"<span class='refTitleHelp'>(Choose as many reasons as apply by clicking on them.)</span>" +
"</span> " +
"<table style='margin:0px;'><tr>";

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
		 		"<table><tr>"; // alternative reasons
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
		 html += "<div id='otherReasons" + ref +"' class='otherReasons'><h2>Other Reasons</h2>" +
		 		"<table style='margin:0px;'><tr>"; // alternative reasons
		 html += spanCITO(arrCITOother, l[z]); // add CiTO for other reasons
		 html += "</tr></table>" +
		 		"</div></div>";
		 
    	l[z].innerHTML +=  html;
 
		
		 /*
		 var newNode = document.createElement('li');
		  newNode.innerHTML = html;
		 
		 l[z].parentNode.insertBefore(newNode, l[z].nextSibling);
		 
		 */
		 
}


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

			chrome.extension.sendMessage({value: value2send}, function(response) {
				// console.log(response.reply); 
				});
		});
		}
		}}



	 

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
				  				"<span>Click here to display or hide other reasons</span></span><br/>";	  
				  
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
						 
						 
					
					 
					 
					 
					var html = html + "<span id='" + id + "' desc='"+ triple +"' class='" + cl + "' onClick='if (this.className == \"tagSelected\") {(this.className=\"tag\");} else if  ( this.className == \"tag\") { (this.className = \"tagSelected\");}'>" + property +  "<span>" + description + "</span></span><br/>";	  
		  
					 
					
					 
					 
					 
					 
					
					 
					 
					 
		  cnt += 1; // increment counter used to assign unique id to each CiTO term span tag
		  }
			  
		  }
		  html = html + "</td>";	
	}
	
	return html;
}


function getObject(div){
	
	 // retrieve url or text citation for reference being cited
	 
	/*
	 * 
	 * <div class="ref-cit-blk half_rhythm" id="r27">27. 
	 * <span>Field D, Garrity G, Gray T, Morrison N, Selengut J, Sterk P, Tatusova T, Thomson N, Allen MJ, Angiuoli SV, et al. 
<span class="ref-title">The minimum information about a genome sequence (MIGS) specification.</span>
<span class="ref-journal">Nat Biotechnol</span>
2008; <span class="ref-vol">26</span>:541-547. doi: 10.1038/nbt1360. 
<span class="nowrap ref pmc">[<a class="int-reflink" href="/pmc/articles/PMC2409278/">PMC free article</a>]</span> 
 <span class="nowrap ref pubmed">[<a href="/pubmed/18464787" target="pmc_ext" onclick="focuswin('pmc_ext')" ref="reftype=pubmed&amp;article-id=3387791&amp;issue-id=211734&amp;journal-id=1427&amp;FROM=Article%7CCitationRef&amp;TO=Entrez%7CPubMed%7CRecord&amp;rendering-type=normal">PubMed</a>]</span> 
 <span class="nowrap ref crossref">[<a href="http://dx.doi.org/10.1038%2Fnbt1360" target="pmc_ext" onclick="focuswin('pmc_ext')" ref="reftype=other&amp;article-id=3387791&amp;issue-id=211734&amp;journal-id=1427&amp;FROM=Article%7CCitationRef&amp;TO=Content%20Provider%7CCrosslink%7CDOI&amp;rendering-type=normal"> Cross Ref</a>]</span>
  </span>
  </div>
	 * 
	 * 
	 * 
	 * 
	*/
	
	
	 var object = "";
	 var regexPUBMEDmatch = /<span class="nowrap ref pubmed">\[<a href=".*".*>PubMed<\/a>\]<\/span>/; //extract pubmed link
	 var regexPUBMEDreplace = /\<span class="nowrap ref pubmed">\[<a href="|".*>PubMed<\/a>\]<\/span>/g;  // extract identifier from pubmed link
	 
	 var regexPMCmatch = /<span class="nowrap ref pmc">\[<a class="int-reflink" href=".*">PMC free article<\/a>]<\/span>/ ; //
	 var regexPMCreplace = /<span class="nowrap ref pmc">\[<a class="int-reflink" href="|">PMC free article<\/a>]<\/span>/g;
	 
	 var regexINDEXreplace = /^\s*\d*\.\s*/;
	 
	 
	 var citedDoc = div.innerHTML;
	 
	 
	 if (citedDoc.match(regexPUBMEDmatch) != null){
		 //extract pubmed link
		 var object = citedDoc.match(regexPUBMEDmatch) + "";
		 // extract identifier from pubmed link
		 var object = object.replace(regexPUBMEDreplace, "");
		 var object = "<http://www.ncbi.nlm.nih.gov" + object + "> ";
		 
		 
	 }
	 else if (citedDoc.match(regexPMCmatch) != null){
	 
		 var object = citedDoc.match(regexPMCmatch) + "";
		 var object = object.replace(regexPMCreplace, "");
		 var object = "<http://www.ncbi.nlm.nih.gov" + object + "> ";
		 
	 }
	 
	 else {
		 
		var object =  div.innerText  ;
		
		var object = '"'  + object.replace(regexINDEXreplace, "") + '"';
		
	 }
	
	return object;
	
}



function save(id, value) {
	  
	  // Check that there's some code there.
	  if (!value) {
	    message('Error: No value specified');
	    return;
	  }
	  // Save it using the HTML5 local storage API.
	  
	  
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
		  new Array("cites as authority",  "cites for information",  "corrects",  "critiques"),
		  new Array("discusses", "extends", "obtains background from",  "reviews"),
		  new Array("updates", "uses data from",  "uses method in" , "OTHER REASON") 	
	);
return arrCITO;
}

function arrCITOother(){
	
	var arrCITOother = new Array(		
			  new Array("agrees with", "cites as data source","cites as evidence", "cites as metadata document","cites as recommended reading","cites as related", "cites as source document","compiles",   "confirms"),
			  new Array( "contains assertion from", "credits","derides",   "disagrees with", "disputes",   "documents","gives background to",   "gives support to",  "has reply"),
			  new Array( "includes excerpt from",   "includes quotation from", "qualifies",   "refutes",   "replies to",   "retracts",  "ridicules",   "shares authors with",   "supports","uses conclusions from")
		);
return arrCITOother;

}







