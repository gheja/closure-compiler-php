<html>
	<head>
		<title>Closure Compiler</title>
		<script type="text/javascript" src="3rdparty/jquery-3.3.1.js"></script>
		<script type="text/javascript" src="main.js"></script>
		<link type="text/css" rel="stylesheet" href="reset.css" />
		<link type="text/css" rel="stylesheet" href="style.css" />
	</head>
	<body>
		<form action="#" method="post" id="form1" onsubmit="onFormSubmit(); return false;">
			<label for="javascript_text">Javascript:</label>
			<textarea name="javascript_text" id="javascript_text"></textarea>
			
			<label for="externs_text">Externs:</label>
			<textarea name="externs_text" id="externs_text"></textarea>
			
			<input type="submit" name="submit" value="Submit" />
		</form>
		
		<div id="status">...</div>
		
		<hr/>
		
		
		<label for="output_js1">Phase 1 output:</label>
		<textarea id="output_js1" readonly="readonly"></textarea>
		
		<label for="output_js2">Phase 2 output:</label>
		<textarea id="output_js2" readonly="readonly"></textarea>
		
		<label for="output_log">Log:</label>
		<pre id="output_log">...</pre>
		
		<a href="#" id="output_link" target="_blank">Output directory</a>
	</body>
</html>
