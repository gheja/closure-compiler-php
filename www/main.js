"use strict";

let _pollTimer;
let _jobId;

function onUploadSuccess(data)
{
	if (!data || data.status === undefined || data.status !== 0)
	{
		// failed
		return;
	}
	
	_jobId = data.job_id;
	
	startPolling();
}

function onUploadError(ajax)
{
	console.log(ajax);
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
	
	$.ajax("upload.php", { async: true, method: "POST", data: data, success: onUploadSuccess, error: onUploadError });
	return false;
}

function onPollCallback()
{
	_window.setTimeout(poll1, 1000);
}

function poll2()
{
	$.ajax("jobs/done/" + _jobId + "/status.json", { success: onPollCallback });
}

function poll1()
{
	$.ajax("jobs/queue/" + _jobId + "/status.json", { success: onPollCallback, error: poll2 });
}

function startPolling()
{
	_pollTimer = window.setInterval(poll1, 1000);
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
