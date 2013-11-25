<?php

	header("content-type: text/xml");

	$data = $HTTP_RAW_POST_DATA;

	// generate filename
	$exportsDir = "exports";
	$randomStr = substr(md5(rand()),0,4);
	$filename = $exportsDir . "/" . "object-" . $randomStr . "_" . date("d.m.y") . ".stl";

	// save the file
	$ptr = fopen($filename, "wb");
	fwrite($ptr, $data);
	fclose($ptr);

	echo "ok";

	return;
?>

