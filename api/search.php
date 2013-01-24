<?php
include("./inc/dbconn.php");

// PARAMETERS
$subject = (isset($_REQUEST['subject'])) ? urldecode($_REQUEST['subject']) : "all";
$userid = (isset($_REQUEST['userid'])) ? $_REQUEST['userid'] : "all";
$format = (isset($_REQUEST['format'])) ? $_REQUEST['format'] :"txt";
$count = (isset($_REQUEST['count'])) ? $_REQUEST['count'] : "";
$object = (isset($_REQUEST['object']))? $_REQUEST['object'] : '';

$predicate = (isset($_REQUEST['predicate']))? $_REQUEST['predicate'] : '';

// DATABASE CONNECTION
$con = dbconn();

mysql_select_db("cito", $con);

$sql = getSQL($subject, $userid, $format, $count, $object, $predicate);


print $sql . "\n\n";
      
$result = mysql_query($sql);
if (!$result){
         die('Invalid query: ' . mysql_error());
}   
    
getOutput($result, $format);

// CLOSE DATABASE
mysql_free_result($result);
mysql_close($con);
        
?>


<?php
// FUNCTIONS

function getSQL($subject, $userid, $format, $count, $object, $predicate){
        if ($count != "") {
$sql =
"Select userid, timestamp, action, subject, predicate, object  from triples where subject = '$subject' and predicate = '$predicate' and object = '$object' ;";
return $sql;
        }

// SQL STATEMENT


if (($subject == 'all') && ($userid == 'all')){
        // SELECT ALL ENTRIES BY ALL AUTHORS
        $sql = "Select userid, timestamp, action, subject, predicate, object from triples  order by timestamp;";

} elseif (($subject == 'all') && ($userid != 'all') )  {
        // SELECT ALL ENTRIES BY A SPECIFIC USER
        $sql = "Select userid, timestamp, action, subject, predicate, object from triples where userid = '$userid' order by timestamp;";
}
elseif (($subject != 'all')&& ($userid == 'all')){
        // SELECT ENTRIES FOR A SPECIFIC ARTICLE BY ALL AUTHORS
        $sql = "Select userid, timestamp, action, subject, predicate, object from triples where subject = '$subject' order by timestamp;";
}
elseif (($subject != 'all')&& ($userid != 'all')){
// SELECT ENTRIES FOR A SPECIFIC ARTICLE BY A SPECIFIC AUTHOR
        $sql = "Select userid, timestamp, action, subject, predicate, object from triples where subject = '$subject' and userid = '$userid' order by timestamp;";
} else {
        // DEFAULT - SELECT ALL ENTRIES BY ALL AUTHORS
        $sql = "Select userid, timestamp, action, subject, predicate, object from triples  order by timestamp;";
}

return $sql;

}

function getOutput($result, $format){


if ($format == 'txt') {
        $output = "";
        while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
                $output .= join("|",$row) ;
        }
        header('Content-type: text/text');
        print $output;
}
elseif ($format == 'json') {
        $output = "";
        $cnt = 1;
        while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
                $output .=
<<<json
{

"userid":"{$row[0]}",
"timestamp": "{$row[1]}",
"action": "{$row[2]}",
"subject" : "{$row[3]}",
"predicate" : "{$row[4]}",
"object" : "{$row[5]}"


},

json;
                $cnt +=1;
	 }
        header('Content-type: application/json');
        print "{\n" . $output . "\n}" ;

} elseif ($format == 'txtf') {

} elseif ($format == 'ttl'){

}
}


?>
                
