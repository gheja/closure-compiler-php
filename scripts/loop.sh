#!/bin/bash

prog=`readlink -f "$0"`
tmp=`dirname "$prog"`
base_dir=`readlink -f "$tmp/.."`

scripts_dir="${base_dir}/scripts"
www_dir="${base_dir}/www"
jobs_dir="${www_dir}/jobs"

cd "${jobs_dir}/queue"

while [ 1 ]; do
	sleep 1
	
	jobs=`ls -1tr | grep -Eo '^[0-9a-z]+$'`
	
	if [ "$jobs" == "" ]; then
		continue
	fi
	
	for job in $jobs; do
		echo $job
		if [ ! -e "${jobs_dir}/queue/${job}/upload_done.flag" ]; then
			echo "b"
			
			continue
		fi
		
		echo "a"
		
		cd "${jobs_dir}/queue/${job}"
		
		{
			echo "{ \"status\": 2, \"status_text\": \"running\", \"result\": 0, \"result_text\": \"ok\" }" > status.json.tmp
			
			# mv is atomic
			mv status.json.tmp status.json
			
			echo "Job: ${job}"
			date '+%Y-%m-%d %H:%M:%S %:z'
			echo ""
			
			$scripts_dir/compiler_run.sh .
			result=$?
			
			echo ""
			date '+%Y-%m-%d %H:%M:%S %:z'
			
			echo ""
			echo "Exit code: $result"
			
			echo ""
			echo "   bytes  file name"
			stat --format '%8s  %n' *
			
			if [ $result == 0 ]; then
				echo "{ \"status\": 4, \"status_text\": \"finished\", \"result\": 0, \"result_text\": \"ok\" }" > status.json.tmp
			else
				echo "{ \"status\": 3, \"status_text\": \"failed\", \"result\": 0, \"result_text\": \"ok\" }" > status.json.tmp
			fi
			
			# mv is atomic
			mv status.json.tmp status.json
		}> main.log 2>&1
		
		cd "${jobs_dir}/queue"
		
		mv "${jobs_dir}/queue/${job}" "${jobs_dir}/done/${job}"
	done
done
