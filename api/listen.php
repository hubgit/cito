<?php

include('inc/dbconn.php');

//http://stackoverflow.com/questions/298745/how-do-i-send-a-cross-domain-post-request-via-javascript
    header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Max-Age: 1000');
    header('Access-Control-Allow-Headers: Content-Type');

$extensionid = extid();
$triple = $_REQUEST['triple'];

$arr = explode("|", $triple);
$action = $arr[2];
$userid = $arr[0];
$subject = urldecode($arr[3]);
$predicate = urldecode($arr[4]);
$object = urldecode($arr[5]);
$extid = $arr[6];

if ($extid != $extensionid){ print "invalid request"; exit;}

$con = dbconn();
mysql_select_db("cito", $con);

if ($action == 'remove'){
        $sql = "DELETE FROM triples where userid ='$userid' and subject='$subject' and predicate='$predicate' and object='$object'";
} else {
        $sql = "INSERT INTO triples (userid,  subject, predicate, object) VALUES ('$userid','$subject','$predicate','$object')";                                          
}



$result = mysql_query($sql);

if (!$result) {
    die('Invalid query: ' . mysql_error());
}


print $result;

mysql_close($con);

        ?>
