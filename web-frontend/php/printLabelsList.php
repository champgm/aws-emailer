<?php
include 'prepareDatabaseConnection.php';

$labelQueryResult = $dbh->query('select label from destinations;');
$labels = array();
while ($row = $labelQueryResult->fetch()){
    array_push($labels, $row['label']);
};

echo json_encode($labels)

?>



