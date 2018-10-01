"use strict";

let _pollTimer;
let _jobId;
let _requestCount = 0;
let _spinnerCharacters = [ "&#x2596;", "&#x2598;", "&#x259D;", "&#x2597;" ];

function get(id)
{
	return document.getElementById(id);
}

function setStatus(a, text)
{
	let obj;
	
	obj = get("status");
	obj.className = a;
	obj.innerHTML = text;
	
	_requestCount++;
	
	get("spinner").innerHTML = _spinnerCharacters[_requestCount % _spinnerCharacters.length];
}

function getOutputFiles()
{
	$.ajax("jobs/done/" + _jobId + "/main.log", { dataType: "text", success: function(a) { get("output_log").innerHTML = a; }, error: function(a) { get("output_log").innerHTML = "error"; } });
	$.ajax("jobs/done/" + _jobId + "/output1.js", { dataType: "text", success: function(a) { get("output_js1").innerHTML = a; }, error: function(a) { get("output_js1").innerHTML = "error"; } });
	$.ajax("jobs/done/" + _jobId + "/output2.js", { dataType: "text", success: function(a) { get("output_js2").innerHTML = a; }, error: function(a) { get("output_js2").innerHTML = "error"; } });
	get("output_link").href = "jobs/done/" + _jobId;
	get("output_files").src = "jobs/done/" + _jobId;
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
	
	data = {
		"javascript_text": get("javascript_text").value,
		"externs_text": get("externs_text").value,
		"single_quotes": get("single_quotes").checked ? "yes" : "",
		"jscomp_off_checkvars": get("jscomp_off_checkvars").checked ? "yes" : "",
		"rewrite_polyfills": get("rewrite_polyfills").checked ? "yes" : "",
	};
	
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

function openTab(n)
{
	let i;
	
	for (i=1; i<=3; i++)
	{
		if (n == i)
		{
			get("tab_head_" + i).className = "tab_head tab_head_active";
			get("tab_content_" + i).style.display = "block";
		}
		else
		{
			get("tab_head_" + i).className = "tab_head";
			get("tab_content_" + i).style.display = "none";
		}
	}
}

function init()
{
	// get("form1").addEventListener("submit", submit);
	openTab(1);
}

window.addEventListener("load", init);
