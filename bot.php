<?php
if($_POST)
{
	$post_body = file_get_contents('php://input');
	$array = json_decode($post_body, true);
	$query = $array['query'];
	$query = rawurlencode($query);
	$sessionId = $array['sessionId'];

	$curl = curl_init();

	curl_setopt_array($curl, array(
	  CURLOPT_URL => "https://api.api.ai/v1/query?v=20160910&query=".$query."&lang=en-us&sessionId=".$sessionId,
	  CURLOPT_RETURNTRANSFER => true,
	  CURLOPT_ENCODING => "",
	  CURLOPT_MAXREDIRS => 10,
	  CURLOPT_TIMEOUT => 30,
	  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	  CURLOPT_CUSTOMREQUEST => "GET",
	  CURLOPT_HTTPHEADER => array(
	    "authorization: Bearer 553ab6017e584e0fa351952c8c9ca956",
	    "cache-control: no-cache",
	  ),
	));

	$response = curl_exec($curl);
	$err = curl_error($curl);

	curl_close($curl);

	if ($err) {
	  echo "cURL Error #:" . $err;
	} else {
	  echo $response;
	}
} else {
	echo "Oops! Lost Souls :P";
}

