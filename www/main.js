"use strict";

let _pollTimer;
let _jobId;

function setStatus(a, text)
{
	let obj;
	
	obj = document.getElementById("status");
	obj.className = a;
	obj.innerHTML = text;
}

function getOutputFiles()
{
	$.ajax("jobs/done/" + _jobId + "/main.log", { success: function(a) { document.getElementById("output_log").innerHTML = a; }, error: function(a) { document.getElementById("output_log").innerHTML = "error"; } });
	$.ajax("jobs/done/" + _jobId + "/output1.js", { success: function(a) { document.getElementById("output_js1").innerHTML = a; }, error: function(a) { document.getElementById("output_js1").innerHTML = "error"; } });
	$.ajax("jobs/done/" + _jobId + "/output2.js", { success: function(a) { document.getElementById("output_js2").innerHTML = a; }, error: function(a) { document.getElementById("output_js2").innerHTML = "error"; } });
	document.getElementById("output_link").href = "jobs/done/" + _jobId;
}

function onUploadSuccess(data)
{
	if (!data || data.status === undefined || data.status !== 0)
	{
		// failed
		return;
	}
	
	_jobId = data.job_id;
	
	setStatus("success", "Upload completed.");
	
	startPolling();
}

function onUploadError(ajax)
{
	console.log(ajax);
	
	setStatus("error", "Upload failed.");
}

function onFormSubmit()
{
	let fields, data, i;
	
	stopPolling();
	
	fields = [ "javascript_text", "externs_text" ];
	data = {};
	
	for (i in fields)
	{
		data[fields[i]] = $("#" + fields[i]).val();
	}
	
	setStatus("error", "Uploading...");
	
	$.ajax("upload.php", { async: true, method: "POST", data: data, success: onUploadSuccess, error: onUploadError });
	
	return false;
}

function onPollFailed(a)
{
	console.log(a);
	
	setStatus("error", "Failed to get status. (See console.)");
}

function onPollSuccess(a)
{
	if (a.result != 0)
	{
		onPollFailed(a);
		return;
	}
	
	if (a.status == 3)
	{
		setStatus("fail", "Compilation failed.");
		getOutputFiles();
		return;
	}
	
	if (a.status == 4)
	{
		setStatus("success", "Successfully compiled.");
		getOutputFiles();
		return;
	}
	
	setStatus("other", a.status_text);
	
	window.setTimeout(poll1, 1000);
}

function poll2()
{
	$.ajax("jobs/done/" + _jobId + "/status.json", { success: onPollSuccess, error: onPollFailed });
}

function poll1()
{
	$.ajax("jobs/queue/" + _jobId + "/status.json", { success: onPollSuccess, error: poll2 });
}

function startPolling()
{
	stopPolling();
	
	_pollTimer = window.setTimeout(poll1, 1000);
}

function stopPolling()
{
	if (_pollTimer)
	{
		window.clearTimeout(_pollTimer);
	}
}

function init()
{
	// document.getElementById("form1").addEventListener("submit", submit);
}

window.addEventListener("load", init);
