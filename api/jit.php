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



function getjson(){
	
	
	 $json = <<<json
{
        id: "190_0",
        name: "Pearl Jam",

        
        children: [{
            id: "306208_1",
            name: "Pearl Jam &amp; Cypress Hill",
            data: {
                relation: "<h4>Pearl Jam &amp; Cypress Hill</h4><b>Connections:</b><ul><li>Pearl Jam <div>(relation: collaboration)</div></li><li>Cypress Hill <div>(relation: collaboration)</div></li></ul>"
            },
            children: [{
                id: "84_2",
                name: "Cypress Hill",
                data: {
                    relation: "<h4>Cypress Hill</h4><b>Connections:</b><ul><li>Pearl Jam &amp; Cypress Hill <div>(relation: collaboration)</div></li></ul>"
                },
                children: []
            }]
        }
        , {
            id: "107877_3",
            name: "Neil Young &amp; Pearl Jam",
            data: {
                relation: "<h4>Neil Young &amp; Pearl Jam</h4><b>Connections:</b><ul><li>Pearl Jam <div>(relation: collaboration)</div></li><li>Neil Young <div>(relation: collaboration)</div></li></ul>"
            },
            children: [{
                id: "964_4",
                name: "Neil Young",
                data: {
                    relation: "<h4>Neil Young</h4><b>Connections:</b><ul><li>Neil Young &amp; Pearl Jam <div>(relation: collaboration)</div></li></ul>"
                },
                children: []
            }]
        }, {
            id: "236797_5",
            name: "Jeff Ament",
            data: {
                relation: "<h4>Jeff Ament</h4><b>Connections:</b><ul><li>Pearl Jam <div>(relation: member of band)</div></li><li>Temple of the Dog <div>(relation: member of band)</div></li><li>Mother Love Bone <div>(relation: member of band)</div></li><li>Green River <div>(relation: member of band)</div></li><li>M.A.C.C. <div>(relation: collaboration)</div></li><li>Three Fish <div>(relation: member of band)</div></li><li>Gossman Project <div>(relation: member of band)</div></li></ul>"
            },
            children: [{
                id: "1756_6",
                name: "Temple of the Dog",
                data: {
                    relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }, {
                id: "14581_7",
                name: "Mother Love Bone",
                data: {
                    relation: "<h4>Mother Love Bone</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }, {
                id: "50188_8",
                name: "Green River",
                data: {
                    relation: "<h4>Green River</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }, {
                id: "65452_9",
                name: "M.A.C.C.",
                data: {
                    relation: "<h4>M.A.C.C.</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: collaboration)</div></li></ul>"
                },
                children: []
            }, {
                id: "115632_10",
                name: "Three Fish",
                data: {
                    relation: "<h4>Three Fish</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }, {
                id: "346850_11",
                name: "Gossman Project",
                data: {
                    relation: "<h4>Gossman Project</h4><b>Connections:</b><ul><li>Jeff Ament <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }]
        }, {
            id: "41529_12",
            name: "Stone Gossard",
            data: {
                relation: "<h4>Stone Gossard</h4><b>Connections:</b><ul><li>Pearl Jam <div>(relation: member of band)</div></li><li>Temple of the Dog <div>(relation: member of band)</div></li><li>Mother Love Bone <div>(relation: member of band)</div></li><li>Brad <div>(relation: member of band)</div></li><li>Green River <div>(relation: member of band)</div></li><li>Gossman Project <div>(relation: member of band)</div></li></ul>"
            },
            children: [{
                id: "1756_13",
                name: "Temple of the Dog",
                data: {
                    relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Stone Gossard <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }, {
                id: "14581_14",
                name: "Mother Love Bone",
                data: {
                    relation: "<h4>Mother Love Bone</h4><b>Connections:</b><ul><li>Stone Gossard <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }, {
                id: "24119_15",
                name: "Brad",
                data: {
                    relation: "<h4>Brad</h4><b>Connections:</b><ul><li>Stone Gossard <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }, {
                id: "50188_16",
                name: "Green River",
                data: {
                    relation: "<h4>Green River</h4><b>Connections:</b><ul><li>Stone Gossard <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }, {
                id: "346850_17",
                name: "Gossman Project",
                data: {
                    relation: "<h4>Gossman Project</h4><b>Connections:</b><ul><li>Stone Gossard <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }]
        }, {
            id: "131161_18",
            name: "Eddie Vedder",
            data: {
                relation: "<h4>Eddie Vedder</h4><b>Connections:</b><ul><li>Pearl Jam <div>(relation: member of band)</div></li><li>Temple of the Dog <div>(relation: member of band)</div></li><li>Eddie Vedder &amp; Zeke <div>(relation: collaboration)</div></li><li>Bad Radio <div>(relation: member of band)</div></li><li>Beck &amp; Eddie Vedder <div>(relation: collaboration)</div></li></ul>"
            },
            children: [{
                id: "1756_19",
                name: "Temple of the Dog",
                data: {
                    relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Eddie Vedder <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }, {
                id: "72007_20",
                name: "Eddie Vedder &amp; Zeke",
                data: {
                    relation: "<h4>Eddie Vedder &amp; Zeke</h4><b>Connections:</b><ul><li>Eddie Vedder <div>(relation: collaboration)</div></li></ul>"
                },
                children: []
            }, {
                id: "236657_21",
                name: "Bad Radio",
                data: {
                    relation: "<h4>Bad Radio</h4><b>Connections:</b><ul><li>Eddie Vedder <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }, {
                id: "432176_22",
                name: "Beck &amp; Eddie Vedder",
                data: {
                    relation: "<h4>Beck &amp; Eddie Vedder</h4><b>Connections:</b><ul><li>Eddie Vedder <div>(relation: collaboration)</div></li></ul>"
                },
                children: []
            }]
        }, {
            id: "236583_23",
            name: "Mike McCready",
            data: {
                relation: "<h4>Mike McCready</h4><b>Connections:</b><ul><li>Pearl Jam <div>(relation: member of band)</div></li><li>Mad Season <div>(relation: member of band)</div></li><li>Temple of the Dog <div>(relation: member of band)</div></li><li>$10,000 Gold Chain <div>(relation: collaboration)</div></li><li>M.A.C.C. <div>(relation: collaboration)</div></li><li>The Rockfords <div>(relation: member of band)</div></li><li>Gossman Project <div>(relation: member of band)</div></li></ul>"
            },
            children: [{
                id: "1744_24",
                name: "Mad Season",
                data: {
                    relation: "<h4>Mad Season</h4><b>Connections:</b><ul><li>Mike McCready <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }, {
                id: "1756_25",
                name: "Temple of the Dog",
                data: {
                    relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Mike McCready <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }, {
                id: "43661_26",
                name: "$10,000 Gold Chain",
                data: {
                    relation: "<h4>$10,000 Gold Chain</h4><b>Connections:</b><ul><li>Mike McCready <div>(relation: collaboration)</div></li></ul>"
                },
                children: []
            }, {
                id: "65452_27",
                name: "M.A.C.C.",
                data: {
                    relation: "<h4>M.A.C.C.</h4><b>Connections:</b><ul><li>Mike McCready <div>(relation: collaboration)</div></li></ul>"
                },
                children: []
            }, {
                id: "153766_28",
                name: "The Rockfords",
                data: {
                    relation: "<h4>The Rockfords</h4><b>Connections:</b><ul><li>Mike McCready <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }, {
                id: "346850_29",
                name: "Gossman Project",
                data: {
                    relation: "<h4>Gossman Project</h4><b>Connections:</b><ul><li>Mike McCready <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }]
        }, {
            id: "236585_30",
            name: "Matt Cameron",
            data: {
                relation: "<h4>Matt Cameron</h4><b>Connections:</b><ul><li>Pearl Jam <div>(relation: member of band)</div></li><li>Soundgarden <div>(relation: member of band)</div></li><li>Temple of the Dog <div>(relation: member of band)</div></li><li>Eleven <div>(relation: supporting musician)</div></li><li>Queens of the Stone Age <div>(relation: member of band)</div></li><li>Wellwater Conspiracy <div>(relation: member of band)</div></li><li>M.A.C.C. <div>(relation: collaboration)</div></li><li>Tone Dogs <div>(relation: member of band)</div></li></ul>"
            },
            children: [{
                id: "1111_31",
                name: "Soundgarden",
                data: {
                    relation: "<h4>Soundgarden</h4><b>Connections:</b><ul><li>Matt Cameron <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }, {
                id: "1756_32",
                name: "Temple of the Dog",
                data: {
                    relation: "<h4>Temple of the Dog</h4><b>Connections:</b><ul><li>Matt Cameron <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }, {
                id: "9570_33",
                name: "Eleven",
                data: {
                    relation: "<h4>Eleven</h4><b>Connections:</b><ul><li>Matt Cameron <div>(relation: supporting musician)</div></li></ul>"
                },
                children: []
            }, {
                id: "11783_34",
                name: "Queens of the Stone Age",
                data: {
                    relation: "<h4>Queens of the Stone Age</h4><b>Connections:</b><ul><li>Matt Cameron <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }, {
                id: "61972_35",
                name: "Wellwater Conspiracy",
                data: {
                    relation: "<h4>Wellwater Conspiracy</h4><b>Connections:</b><ul><li>Matt Cameron <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }, {
                id: "65452_36",
                name: "M.A.C.C.",
                data: {
                    relation: "<h4>M.A.C.C.</h4><b>Connections:</b><ul><li>Matt Cameron <div>(relation: collaboration)</div></li></ul>"
                },
                children: []
            }, {
                id: "353097_37",
                name: "Tone Dogs",
                data: {
                    relation: "<h4>Tone Dogs</h4><b>Connections:</b><ul><li>Matt Cameron <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }]
        }, {
            id: "236594_38",
            name: "Dave Krusen",
            data: {
                relation: "<h4>Dave Krusen</h4><b>Connections:</b><ul><li>Pearl Jam <div>(relation: member of band)</div></li><li>Candlebox <div>(relation: member of band)</div></li></ul>"
            },
            children: [{
                id: "2092_39",
                name: "Candlebox",
                data: {
                    relation: "<h4>Candlebox</h4><b>Connections:</b><ul><li>Dave Krusen <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }]
        }, {
            id: "236022_40",
            name: "Matt Chamberlain",
            data: {
                relation: "<h4>Matt Chamberlain</h4><b>Connections:</b><ul><li>Pearl Jam <div>(relation: member of band)</div></li><li>Critters Buggin <div>(relation: member of band)</div></li><li>Edie Brickell and New Bohemians <div>(relation: member of band)</div></li></ul>"
            },
            children: [{
                id: "54761_41",
                name: "Critters Buggin",
                data: {
                    relation: "<h4>Critters Buggin</h4><b>Connections:</b><ul><li>Matt Chamberlain <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }, {
                id: "92043_42",
                name: "Edie Brickell and New Bohemians",
                data: {
                    relation: "<h4>Edie Brickell and New Bohemians</h4><b>Connections:</b><ul><li>Matt Chamberlain <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }]
        }, {
            id: "236611_43",
            name: "Dave Abbruzzese",
            data: {
                relation: "<h4>Dave Abbruzzese</h4><b>Connections:</b><ul><li>Pearl Jam <div>(relation: member of band)</div></li><li>Green Romance Orchestra <div>(relation: member of band)</div></li></ul>"
            },
            children: [{
                id: "276933_44",
                name: "Green Romance Orchestra",
                data: {
                    relation: "<h4>Green Romance Orchestra</h4><b>Connections:</b><ul><li>Dave Abbruzzese <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }]
        }, {
            id: "236612_45",
            name: "Jack Irons",
            data: {
                relation: "<h4>Jack Irons</h4><b>Connections:</b><ul><li>Pearl Jam <div>(relation: member of band)</div></li><li>Redd Kross <div>(relation: member of band)</div></li><li>Eleven <div>(relation: member of band)</div></li><li>Red Hot Chili Peppers <div>(relation: member of band)</div></li><li>Anthym <div>(relation: member of band)</div></li><li>What Is This? <div>(relation: member of band)</div></li></ul>"
            },
            children: [{
                id: "4619_46",
                name: "Redd Kross",
                data: {
                    relation: "<h4>Redd Kross</h4><b>Connections:</b><ul><li>Jack Irons <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }, {
                id: "9570_47",
                name: "Eleven",
                data: {
                    relation: "<h4>Eleven</h4><b>Connections:</b><ul><li>Jack Irons <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }, {
                id: "12389_48",
                name: "Red Hot Chili Peppers",
                data: {
                    relation: "<h4>Red Hot Chili Peppers</h4><b>Connections:</b><ul><li>Jack Irons <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }, {
                id: "114288_49",
                name: "Anthym",
                data: {
                    relation: "<h4>Anthym</h4><b>Connections:</b><ul><li>Jack Irons <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }, {
                id: "240013_50",
                name: "What Is This?",
                data: {
                    relation: "<h4>What Is This?</h4><b>Connections:</b><ul><li>Jack Irons <div>(relation: member of band)</div></li></ul>"
                },
                children: []
            }]
        }],
        data: {
            relation: "<h4>Pearl Jam</h4><b>Connections:</b><ul><li>Pearl Jam &amp; Cypress Hill <div>(relation: collaboration)</div></li><li>Neil Young &amp; Pearl Jam <div>(relation: collaboration)</div></li><li>Jeff Ament <div>(relation: member of band)</div></li><li>Stone Gossard <div>(relation: member of band)</div></li><li>Eddie Vedder <div>(relation: member of band)</div></li><li>Mike McCready <div>(relation: member of band)</div></li><li>Matt Cameron <div>(relation: member of band)</div></li><li>Dave Krusen <div>(relation: member of band)</div></li><li>Matt Chamberlain <div>(relation: member of band)</div></li><li>Dave Abbruzzese <div>(relation: member of band)</div></li><li>Jack Irons <div>(relation: member of band)</div></li></ul>"
        }
    }
json;
    
    return $json;
}

?>
                