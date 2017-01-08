<?php

$dbhost = getenv('RDS_HOSTNAME');
$dbport = getenv('RDS_PORT');
$dbname = getenv('RDS_DB_NAME');

$dsn = "mysql:host={$dbhost};port={$dbport};dbname={$dbname}";
$username = getenv('RDS_USERNAME');
$password = getenv('RDS_PASSWORD');

$dbh = new PDO($dsn, $username, $password);
$dbh->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

?>