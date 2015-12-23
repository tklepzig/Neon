#!/bin/bash

gulp start-server &
#sometimes gulp dev crashes and nobody notice it...
#ugly, but loop it to ensure a restart if gulp dev crashes
trap "exit" INT
while true
do
	gulp dev
	sleep 0.1
done
