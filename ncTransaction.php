<?php

  $countLog = new DOMDocument;
  $countLog->loadXML(file_get_contents("gs://nclog/ncLog.xml"));
  $root = $countLog->documentElement;
  $newNode = $countLog->createDocumentFragment();
  $newNode->appendXML(file_get_contents("php://input"));
  $root->appendChild($newNode);
  file_put_contents("gs://nclog/ncLog.xml", $countLog->saveXML());

  echo "we are good";
?>
