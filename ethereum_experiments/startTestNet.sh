#!/bin/bash
geth --genesis test_genesis_block.json  --datadir ./ethereum_experiment --networkid 123 --nodiscover --maxpeers 0 console 2>> $1
