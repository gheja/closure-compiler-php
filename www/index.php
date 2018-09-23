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
	</body>
</html>
