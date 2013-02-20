<?php
include("./inc/dbconn.php");

//http://stackoverflow.com/questions/298745/how-do-i-send-a-cross-domain-post-request-via-javascript
    header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);
    header('Access-Control-Allow-Methods: GET');
    header('Access-Control-Max-Age: 1000');
    header('Access-Control-Allow-Headers: Content-Type');


// PARAMETERS
$subject = (isset($_REQUEST['subject'])) ? $_REQUEST['subject'] : "all";
$userid = (isset($_REQUEST['userid'])) ? $_REQUEST['userid'] : "all";
$format = (isset($_REQUEST['format'])) ? $_REQUEST['format'] :"txt";
$count = (isset($_REQUEST['count'])) ? $_REQUEST['count'] : "";
$object = (isset($_REQUEST['object']))? $_REQUEST['object'] : '';
$predicate = (isset($_REQUEST['predicate']))? $_REQUEST['predicate'] : '';
$query = (isset($_REQUEST['query'])) ? $_REQUEST['query'] : '';
$count = (isset($_REQUEST['count'])) ? $_REQUEST['count'] : '';


$sql = getSQL($subject, $userid, $format,  $object, $predicate, $query, $count);
 




// DATABASE CONNECTION
$con = dbconn();

mysql_select_db("cito", $con);


$result = mysql_query($sql);
if (!$result){
         die('Invalid query: ' . mysql_error());
}

getOutput($result, $format, $query);

// CLOSE DATABASE
mysql_free_result($result);
mysql_close($con);

?>

<?php
// FUNCTIONS

function getSQL($subject, $userid, $format,  $object, $predicate, $query, $count){
	
	if ($query == 'endorsed') {
		
		if (is_numeric($count) == false) { $count = 0;}
		
		$sql = "select distinct subject, predicate, object from triples where subject
	 in (select subject from triples group by subject having count(subject) >= $count)
	  and predicate in (select predicate from 
	triples group by predicate having count(predicate) >= $count)
	 and object in (select object from triples group by object having count(object) >= $count) order by subject;";
	
		
		
return $sql;		
	}
	
// SQL STATEMENT


if (($subject == 'all') && ($userid == 'all')){
        // SELECT ALL ENTRIES BY ALL AUTHORS
     $sql = "Select userid, timestamp,  subject, predicate, object from triples  order by subject;";

} elseif (($subject == 'all') && ($userid != 'all') )  {
        // SELECT ALL ENTRIES BY A SPECIFIC USER
        $sql = "Select userid, timestamp,  subject, predicate, object from triples where userid = '$userid'   order by subject;";

}
elseif (($subject != 'all')&& ($userid == 'all')){
        // SELECT ENTRIES FOR A SPECIFIC ARTICLE BY ALL AUTHORS
        $sql = "Select userid, timestamp,  subject, predicate, object from triples where subject = '$subject'  order by subject;";
}
elseif (($subject != 'all')&& ($userid != 'all')){
        // SELECT ENTRIES FOR A SPECIFIC ARTICLE BY A SPECIFIC AUTHOR
        $sql = "Select userid, timestamp,  subject, predicate, object from triples where subject = '$subject' and userid = '$userid' order by subject;";
} else {
        // DEFAULT - SELECT ALL ENTRIES BY ALL AUTHORS
        $sql = "Select userid, timestamp,  subject, predicate, object from triples  order by subject;";
}
return $sql;

}

function getOutput($result, $format, $query){

if ($format == 'txt') {
        $output = "";
        while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
                $output .= join("|",$row) . "\n" ;
        }
        header('Content-type: text/text');
        print $output;
}
elseif ($format == 'json') {
        $output = "";
        $cnt = 1;
        
        $num_rows = mysql_num_rows($result);

        while ($row = mysql_fetch_array($result, MYSQL_NUM)) {

        if ($query == 'endorsed'){
                 $output .=
<<<json
{
"subject" : "{$row[0]}",
"predicate" : "{$row[1]}",
"object" : "{$row[2]}"
}
json;

   } else {
          $output .=
<<<json
{
"userid":"{$row[0]}",
"timestamp": "{$row[1]}",
"subject" : "{$row[2]}",
"predicate" : "{$row[3]}",
"object" : "{$row[4]}"
}
json;

  }

  if ($cnt != $num_rows) { $output .= ",\n"; }
  
  $cnt +=1;
        }
        header('Content-type: application/json');
        print "{\n" . $output . "\n}" ;
} elseif ($format == 'txtf') {

 $output = "";
        while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
                $output .= join(" | ",$row) . "\n" ;
        }
        header('Content-type: text/text');
        print $output;

} elseif ($format == 'ttl'){

 $output = "";
        while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
        
        	 if ($query == 'endorsed'){
        	 	$output .= "{$row[0]} {$row[1]} {$row[2]} . \n"; 
        	 	
        	 } else {
        	
        	$output .= "{$row[2]} {$row[3]} {$row[4]} . \n"; 
        	 }
        }
        header('Content-type: text/text');
        print $output;


}
}


?>

