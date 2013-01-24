<?php

include('inc/dbconn.php');


header("Content-type: text/text");

$subject = urldecode($_REQUEST['subject']); // remove url encoding from subject parameter

$namespace = ns();

$result = querydb($subject);

$output =

<<<output
$namespace
@base $subject.

# The title of this document is "Additional File 3: Citation Metadata".

# This file contains metadata descriptions of the citations in the article by
# Shotton DM (2010) CiTO, the Citation Typing Ontology. Journal of Biomedical Semantics 1(Suppl 1): S6.

# These metadata are prepared using CiTO v1.6 and are encoded as RDF using Notation3 format.
# This documents validates as valid RDF using <http://www.rdfabout.com/demo/validator/>.

# This document information file has been prepared by and is copyright (c) David Shotton, University of Oxford, 16 March 2010.   This document is an open access reference work distributed under the terms of the Creative Commons Attribution License 2.5, which permits unrestricted use, distribution, and reproduction in any medium, provided that the original author and source are credited.
# Reformatted 09 July 2010 to increase legibility and correct a syntactic error.

# This document is an open access reference work distributed under the terms of the Creative Commons Attribution License 2.5, which permits unrestricted use, distribution, and reproduction in any medium, provided that the original author and source are credited.

# Contact <david.shotton@zoo.ox.ac.uk> for further information.

# about this metadata document ...
<http://dx.doi.org/10.1186/2041-1480-1-S1-S6/suppl/S3>  # Supplementary File S3
        dc:creator [ a foaf:Person ; foaf:name "David Shotton" ; foaf:mbox <mailto:david.shotton@zoo.ox.ac.uk> ] ;
        rdf:type [a cito:CitationMetadata] ; # work
        dc:subject <http://dx.doi.org/10.1186/2041-1480-1-S1-S6> ;
        cito:cites <http://dx.doi.org/10.1186/2041-1480-1-S1-S6> ;
        cito:citesAsSourceDocument <http://dx.doi.org/10.1186/2041-1480-1-S1-S6> ;
        cito:isCitedBy <http://dx.doi.org/10.1186/2041-1480-1-S1-S6> ;
        dc:date "2010-03-16"^^xsd:date ;
        dcterms:license <http://creativecommons.org/licenses/by/2.5/> .

<cito:cites $subject # The CiTO paper in JBMS
dcterms:issued "2010-06-22" ;
    cito:cites <http://dx.doi.org/10.1186/2041-1480-1-S1-S6/suppl/S3> ;
    cito:citesAsMetadataDocument <http://dx.doi.org/10.1186/2041-1480-1-S1-S6/suppl/S3> ;
    cito:isCitedBy <http://dx.doi.org/10.1186/2041-1480-1-S1-S6/suppl/S3> ;
    cito:isRealizationOf cito:Proposition ; # work
    rdf:type cito:JournalArticle ; # expression
    cito:peerReviewed "true"^^xsd:boolean ; # peer review status
        dc:title "CiTO, the Citation Typing Ontology" ;
        dc:identifier   <http://dx.doi.org/10.1186/2041-1480-1-S1-S6> ;
        dc:language     "en" ;
        dcterms:bibliographicCitation   " David Shotton (2010). CiTO, the Citation Typing Ontology.  Journal of Biomedical Semantics 1(Suppl 1): S6.  doi:10.1186/2041-1480-1-S1-S6/suppl/S3 " .
$subject

$result



output;

print $output;






function ns(){

$namespace = <<<ns

@prefix cito:   <http://purl.org/net/cito/>.
@prefix frbr:   <http://purl.org/vocab/frbr/core#>.
@prefix rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix rdfs:   <http://www.w3.org/2000/01/rdf-schema#>.
@prefix dc:     <http://purl.org/dc/elements/1.1/>.
@prefix cc:     <http://web.resource.org/cc/>.
@prefix foaf:   <http://xmlns.com/foaf/0.1/>.
@prefix prism:  <http://prismstandard.org/namespaces/1.2/basic/>.
@prefix geo:    <http://www.w3.org/2003/01/geo/wgs84_pos#>.
@prefix dcterms: <http://purl.org/dc/terms/>.
@prefix time: <http://www.w3.org/2006/time#>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.

ns;

return $namespace;




}

function querydb($subject){
$txt = "";

$con = dbconn();


mysql_select_db("cito", $con);

$sql = "Select distinct subject, predicate, object from triples where subject = '$subject';";
$result = mysql_query($sql);


while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
$predicate =$row[1];
        $object = $row[2];
$object = str_replace(array("\r", "\n", "\r\n"), " ", $object);
$cites = "<http://purl.org/spar/cito/cites>";
$txt .= "$cites $object;\n";
$txt .=  "$predicate $object;\n\n";

}



mysql_free_result($result);

mysql_close($con);

return $txt;

}



?>

