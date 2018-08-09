#!/bin/sh
str=`git status | grep "committed"`
len=${#str}
if [ ${len} -eq 64 ];then
    echo ok
fi
