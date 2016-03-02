#!/bin/bash
LINE=$(tr '\n' ' ' < $1)
echo "source = \"$LINE\"" > $2

