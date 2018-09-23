<?php
	header("Content-type: application/json");
	
	while (1)
	{
		$job_id = hash("sha256", openssl_random_pseudo_bytes(64));
		
		if (!file_exists("./jobs/queue/" . $job_id) && !file_exists("./jobs/done/" . $job_id))
		{
			break;
		}
	}
	
	$config = array(
		"language_in" => "auto",
		"language_out" => "auto",
		"single_quotes" => "no",
		"jscomp_off_checkvars" => "no",
		"rewrite_polyfills" => "no",
		"externs" => "no",
		"advzip_level" => "0"
	);
	
//	$a = array("language_in", "language_out");
//	$b = array("auto", "")
	
	
	$a = array("single_quotes", "jscomp_off_checkvars", "rewrite_polyfills");
	
	foreach ($a as $key => $tmp)
	{
		if (array_key_exists($key, $_POST) && $_POST[$key] == "yes")
		{
			$config[$key] = "yes";
		}
	}
	
	mkdir("./jobs/queue/" . $job_id);
	chdir("./jobs/queue/" . $job_id);
	
	file_put_contents("status.json", "{ \"status\": 1, \"status_text\": \"queued\", \"result\": 0, \"result_text\": \"ok\" }");
	file_put_contents("input.js", $_POST["javascript_text"]);
	
	if ($_POST["externs_text"] != "")
	{
		$config["externs"] = "yes";
		file_put_contents("externs.js", $_POST["externs_text"]);
	}
	
	
	$config_string = "";
	
	foreach ($config as $key => $value)
	{
		$config_string .= $key . "=\"" . $value . "\"\n";
	}
	
	file_put_contents("config.txt", $config_string);
	touch("upload_done.flag");
	
	echo "{ \"status\": 0, \"status_text\": \"ok\", \"job_id\": \"" . $job_id . "\" }";
?>
