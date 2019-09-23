<?php

  $dom = new DOMDocument;
  $zFileContents = file_get_contents("gs://nclog/ncLog.xml");
  $dom->loadXML($zFileContents); 

  $xsl = new DOMDocument;
  $zFileContents = file_get_contents("gs://nclog/ncLog.xslt");
  $xsl->loadXML($zFileContents); 
  $proc = new XSLTProcessor;
  $proc->importStyleSheet($xsl);
  $clientXML = $proc->transformToDoc($dom);
      
  echo $clientXML->saveXML();
?>
