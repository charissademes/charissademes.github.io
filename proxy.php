<?php
header('Content-Type: text/xml');
$apiUrl = 'https://speedskatingresults.com/api/xml/personal_records.php?skater=92774';
echo file_get_contents($apiUrl);
?>
