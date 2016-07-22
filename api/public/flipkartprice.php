<?php
	// $url = "http://www.flipkart.com/samsung-galaxy-j7-6-new-2016-edition/p/itmegmrnggh56u22";
	$url = "http://www.flipkart.com/mobiles/samsung~brand/pr?sid=tyy,4io&otracker=nmenu_sub_electronics_0_Samsung";
	$opts = array('http' => array('header' => "User-Agent:MyAgent/1.0\r\n"));
	$context = stream_context_create($opts);
	$header = file_get_contents($url, FALSE, $context);

  	$dom = new DOMDocument();
    @$dom->loadHTML($header);
    $flipkartprice = 0;

     $xPath = new DOMXPath($dom);

     $elements = $xPath->query("//*[@class='gd-col gu3']/div[@class='product-unit unit-4 browse-product new-design ']/div[@class='pu-visual-section']/a");

    foreach ($elements as $e) { 
        $urlhref = "http://www.flipkart.com".$e->getAttribute("href");

		$optsn = array('http' => array('header' => "User-Agent:MyAgent/1.0\r\n"));
		$contextn = stream_context_create($optsn);
		$headern = file_get_contents($urlhref, FALSE, $contextn);

	  	$domn = new DOMDocument();
	    @$domn->loadHTML($headern);
	    $flipkartprice = 0;

	     $xPathn = new DOMXPath($domn);

	     $elenew = $xPathn->query("//*[@class='product-details line']/div[@class='title-wrap line fk-font-family-museo section omniture-field']/h1[@class='title']");
	     foreach ($elenew as $el) { 
	          $name = $el->nodeValue;
	      }
	     $elementsn = $xPathn->query("//*[@class='price-wrap']/div[@class='pricing line']/div[@class='prices']/div/span");
	      foreach ($elementsn as $en) { 
	          $flipkartprice = $en->nodeValue;
	      }

	      echo $name."=".$flipkartprice."<br>";
  	}