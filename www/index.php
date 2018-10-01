<html>
	<head>
		<title>Closure Compiler</title>
		<script type="text/javascript" src="3rdparty/jquery-3.3.1.js"></script>
		<script type="text/javascript" src="main.js"></script>
		<link type="text/css" rel="stylesheet" href="reset.css" />
		<link type="text/css" rel="stylesheet" href="style.css" />
	</head>
	<body>
		<div id="left-side">
			<div class="container">
				<form action="#" method="post" id="form1" onsubmit="onFormSubmit(); return false;">
					<label for="javascript_text">Javascript:</label>
					<textarea name="javascript_text" id="javascript_text"></textarea>
					
					<label for="externs_text">Externs:</label>
					<textarea name="externs_text" id="externs_text"></textarea>
					
					<input type="checkbox" id="single_quotes" name="single_quotes" value="yes"> single quotes<br/>
					<input type="checkbox" id="jscomp_off_checkvars" name="jscomp_off_checkvars" value="yes"> jscomp off checkvars<br/>
					<input type="checkbox" id="rewrite_polyfills" name="rewrite_polyfills" value="yes"> rewrite polyfills<br/>
					
					<input type="submit" name="submit" value="Submit" />
				</form>
			</div>
		</div>
		
		<div id="right-side">
			<div class="container">
				<span id="spinner">.</span>&nbsp;<span id="status">...</span>
				
				
				<hr/>
				
				<ul id="tabs">
					<li id="tab_head_1"><a href="#" onclick="openTab(1); return false;">Phase 1</a></li>
					<li id="tab_head_2"><a href="#" onclick="openTab(2); return false;">Phase 2</a></li>
					<li id="tab_head_3"><a href="#" onclick="openTab(3); return false;">Files</a></li>
				</ul>
				
				<div class="tab_content" id="tab_content_1">
					<textarea id="output_js1" readonly="readonly"></textarea>
				</div>
				
				<div class="tab_content" id="tab_content_2">
					<textarea id="output_js2" readonly="readonly"></textarea>
				</div>
				
				<div class="tab_content" id="tab_content_3">
					<iframe id="output_files" src="about:blank"></iframe>
					<a href="#" id="output_link" target="_blank">Open in new tab</a>
				</div>
			</div>
		</div>
	</body>
</html>
