<?php
include("./inc/dbconn.php");

// PARAMETERS
$subject = (isset($_REQUEST['subject'])) ? "<" . $_REQUEST['subject'] . ">" : "";



if ($subject == ''){

$subject = "<http://www.ncbi.nlm.nih.gov/pmc/articles/PMC2292260/>";

}
$children = getj($subject, 1);

$subject = preg_replace("/<|>/", "", $subject);
$name = substr($subject, -10);

$json = <<<json
{
id: "$subject",
name: "$subject",
data : {
relation: "",
url: "$subject",
parenturl: ""

},
children : [
$children
]
}

json;


//$json = getjson();
print $json;
exit;


function getj($varsubject, $counter){	
//print $subject . "\n";	
	
$json = "";	
$cnt = 0;

// get list of equivalent urls for journal article using sameas
// then call cito/api with array of equivalent urls, appending results to $result variable

$querysameas = "http://www.miidi.org/sameas/?f=text&uri=" . preg_replace("/<|>|\n/", "", $varsubject);

$arrSubjects = array();

$arrFile = file($querysameas);

$arrSubject = array_slice($arrFile, 2);

foreach($arrSubject as $sub){
	
	$sub = preg_replace("/\n/", "", $sub);
	
	if (in_array($sub, $arrSubjects) == FALSE) {
	array_push($arrSubjects, $sub);
	}
	
	$new =  (preg_match("/\/>$/", $sub) == 0) ? preg_replace("/>$/", "/>", $sub) : "";
	
if ((in_array($new, $arrSubjects) == FALSE) && ($new != '')) {
	array_push($arrSubjects, $new);
	}
	
	
	} 



	


//	print_r($arrSubjects);

$arrObjects = array();

foreach($arrSubjects as $subject) {

$subject = preg_replace("/\n/", "", $subject);	
$subject = (preg_match("/^</", $subject) == 1) ? $subject : "<$subject>";

$query = "http://www.miidi.org/cito/api/search?subject=" . $subject;

//print "\n" . $query ;
$result = file($query);	
$size = count($result);	

foreach ($result as $line) {
	$arr = explode("|", $line);

	$predicate = preg_replace("/<|>|\n/", "", $arr[3]);
	$object = preg_replace("/\"|<|>|\n/", "", $arr[4]);	
	
	
	if ($object != ''){
	if (array_key_exists($object, $arrObjects)){
		
		$arrPredicates = $arrObjects[$object];
		
		if (!in_array($predicate, $arrObjects[$object])) {
		array_push($arrObjects[$object], $predicate);
	
	}
		
	} else {
		$arrObjects[$object] = array($predicate);
		
	}}

}}

//print_r($arrObjects);




foreach ($arrObjects as $object=>$arrPredicate) {
	$cnt++;
	$counter++;
	
	$subject = preg_replace("/<|>|\n/", "", $varsubject);
	
	$predicate =   "<div class='subtitle'>How does $subject cite this article?</div><br/><ol>";
	
	//$predicate = "";
	
	foreach($arrPredicate as $pred){
		//$predicate .= "<br/><a href='$subject'>$subject</a> &nbsp;&nbsp; <a href='$pred'>$pred</a> &nbsp;&nbsp <a href='$object'>$object</a>";

		$predicate .= "<li>$pred</li>";
		
	}
	
	$predicate .= "</ol>";
	
	

	
if (preg_match("/^http/", $object) == 1){	
	
		
$children = getj($object, $counter * 100000000);
}

$divider = ($cnt == count($arrObjects)) ? "" : ",";
	
$name = ".." . substr($object, -20);

$json .= 
<<<json
{
id: "$counter",
name: "$object",
data : {
relation: "$predicate",
url: "$object",
parenturl: "$subject"
},
children : [
$children
]
} $divider

json;

}


return $json;




}





//$array2Output = array();

//$output = getOutput($result);

// CLOSE DATABASE
//mysql_free_result($result);
//mysql_close($con);

?>

<?php
// FUNCTIONS

function getSQL($subject){
        $sql = "Select distinct subject, predicate, object from triples  where subject = '$subject' order by timestamp;";
        print $sql . "\n";
        return $sql;
}

function getOutput($result){
        $output = "";
        $cnt = 0;
        $array2Output = array();

        $num_rows = mysql_num_rows($result);

        while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
                $subject = $row[0];
 $object = $row[2];
                $childArray = childArray($object);
                $row[] = $childArray;
                $array2Output[$cnt] = $row;
                $cnt ++;
        }


print_r($array2Output);

        //  if ($cnt != $num_rows) { $output .= ",\n"; }
        // $cnt +=1;
        header('Content-type: application/json');
        print "{\n" . $output . "\n}" ;
}


function childArray($subject) {

$sql = getSQL($subject);
$result = mysql_query($sql);
$array2return = array();

if (!$result){
        die('Invalid query: ' . mysql_error());
}
        $cnt = 0;
while ($row = mysql_fetch_array($result, MYSQL_NUM)) {

        $array2return[] = $row;

        $cnt += 1;
}

        return $array2return;
}




?>
                