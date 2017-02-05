<?php
include 'prepareDatabaseConnection.php';

$search = $_POST['search'];

$labelQueryResult = $dbh->prepare("select label from destinations where label like ?");
$labelQueryResult->execute(array("%$search%"));

$labels = $labelQueryResult->fetchAll();

echo json_encode($labels);

?>