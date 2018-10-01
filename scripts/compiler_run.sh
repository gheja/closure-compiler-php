#!/bin/bash

prog=`readlink -f "$0"`
tmp=`dirname "$prog"`
base_dir=`readlink -f "$tmp/.."`

bin_dir="${base_dir}/bin"


### find the most recent binaries

java=`ls -1t $bin_dir/jre*/bin/java $bin_dir/jdk*/bin/java 2>/dev/null | sort | head -n 1`
compiler=`ls -1t $bin_dir/compiler*/closure-compiler-*.jar 2>/dev/null | sort | head -n 1`
advzip=`ls -1t $bin_dir/advancecomp*/advzip 2>/dev/null | sort | head -n 1`

if [ "$java" == "" ]; then
	echo "Could not find java, exiting."
	exit 1
fi

if [ "$compiler" == "" ]; then
	echo "Could not find Closure Compiler, exiting."
	exit 1
fi

if [ "$advzip" == "" ]; then
	echo "Could not find advzip, exiting."
	exit 1
fi


### sanity checks on config
# TODO: race condition protection (i.e. config changes between checks and use)

if [ ! -s config.txt ]; then
	echo "Empty config, exiting."
	exit 1
fi

cat config.txt | grep -vqE '^[0-9a-zA-Z_]+="[0-9a-zA-Z_]+"$'

if [ $? == 0 ]; then
	echo "Invalid config, exiting."
	exit 1
fi

###


# TODO: does @output_file_name has the precedence? (could it be used to overwrite arbitary file?)

. config.txt

options=""
options2=""

if [ "$language_in" != "auto" ]; then
	options="$options --language_in $language_in"
fi

if [ "$language_out" != "auto" ]; then
	options="$options --language_out $language_out"
fi

if [ "$single_quotes" == "yes" ]; then
	options="$options --formatting SINGLE_QUOTES"
	options2="$options2 --formatting SINGLE_QUOTES"
fi

if [ "$jscomp_off_checkvars" == "yes" ]; then
	options="$options --jscomp_off=checkVars"
fi

if [ "$rewrite_polyfills" == "yes" ]; then
	options="$options --rewrite_polyfills"
fi

if [ "$externs" == "yes" ]; then
	options="$options --externs externs.js"
fi

echo "{ \"status\": 2, \"status_text\": \"Running... Closure Compiler (phase 1)\", \"result\": 0, \"result_text\": \"ok\" }" > status.json.tmp
# mv is atomic
mv status.json.tmp status.json

$java -jar $compiler \
	--compilation_level ADVANCED_OPTIMIZATIONS \
	--js input.js \
	--js_output_file output1.js \
	--create_source_map output1.js.map \
	--variable_renaming_report output1.js.vars \
	--property_renaming_report output1.js.properties \
	--logging_level FINEST \
	--warning_level VERBOSE \
	--formatting PRETTY_PRINT \
	--summary_detail_level 3 \
	$options > output1.log 2>&1

if [ $? != 0 ]; then
	echo "Closure compiler (phase 1) returned an error, exiting."
	exit 1
fi

echo "{ \"status\": 2, \"status_text\": \"Running... Closure Compiler (phase 2)\", \"result\": 0, \"result_text\": \"ok\" }" > status.json.tmp
# mv is atomic
mv status.json.tmp status.json

$java -jar $compiler \
	--compilation_level WHITESPACE_ONLY \
	--js output1.js \
	--js_output_file output2.js \
	--logging_level FINEST \
	--warning_level VERBOSE \
	--summary_detail_level 3 \
	$options2 > output2.log 2>&1

if [ $? != 0 ]; then
	echo "Closure compiler (phase 2) returned an error, exiting."
	exit 1
fi

echo "{ \"status\": 2, \"status_text\": \"Running... Advzip (phase 1)\", \"result\": 0, \"result_text\": \"ok\" }" > status.json.tmp
# mv is atomic
mv status.json.tmp status.json

$advzip -a output2.zip output2.js

if [ $? != 0 ]; then
	echo "Advzip (phase 1) returned an error, exiting."
	exit 1
fi

echo "{ \"status\": 2, \"status_text\": \"Running... Advzip (phase 2)\", \"result\": 0, \"result_text\": \"ok\" }" > status.json.tmp
# mv is atomic
mv status.json.tmp status.json

if [ "$advzip_level" != "0" ]; then
	$advzip -z -4 -i 500 output2.zip
	
	if [ $? != 0 ]; then
		echo "Advzip (phase 2) returned an error, exiting."
		exit 1
	fi
fi

exit 0
