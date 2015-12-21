#!/bin/bash

nodemon server/index.js &
#sometimes gulp dev crashes and nobody notice it...
#ugly, but loop it to ensure a restart if gulp dev crashes
while true
do
	gulp dev
	sleep 0.1
done